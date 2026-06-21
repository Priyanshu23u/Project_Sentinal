package proxy

import (
	"backend/internal/circuitbreaker"
	"backend/internal/metrics"
	"context"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"
)

type Router struct {
	PrimaryProxy   *httputil.ReverseProxy
	SecondaryProxy *httputil.ReverseProxy

	CircuitBreaker *circuitbreaker.CircuitBreaker
}

func NewRouter(cb *circuitbreaker.CircuitBreaker) *Router {

	primaryURL, err := url.Parse(
		"http://toxiproxy:8666",
	)
	if err != nil {
		panic(err)
	}

	secondaryURL, err := url.Parse(
		"http://secondary-api:8082",
	)
	if err != nil {
		panic(err)
	}

	return &Router{
		PrimaryProxy:   httputil.NewSingleHostReverseProxy(primaryURL),
		SecondaryProxy: httputil.NewSingleHostReverseProxy(secondaryURL),
		CircuitBreaker: cb,
	}
}

func (rt *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	metrics.IncrementRPS()
	metrics.IncrementActiveRoutes()
	defer metrics.DecrementActiveRoutes()

	// Circuit OPEN -> Directly use Secondary API
	if !rt.CircuitBreaker.AllowRequest() {
		rt.SecondaryProxy.ServeHTTP(w, r)
		return
	}

	ctx, cancel := context.WithTimeout(
		r.Context(),
		200*time.Millisecond,
	)
	defer cancel()

	req := r.Clone(ctx)

	done := make(chan bool, 1)

	go func() {

		recorder := &statusRecorder{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		rt.PrimaryProxy.ServeHTTP(recorder, req)

		if recorder.statusCode >= 500 {

			rt.CircuitBreaker.RecordFailure()
			metrics.IncrementFailure()

			done <- false
			return
		}

		rt.CircuitBreaker.RecordSuccess()
		metrics.IncrementSuccess()

		done <- true
	}()

	select {

	case success := <-done:

		if !success {
			rt.SecondaryProxy.ServeHTTP(w, r)
		}

	case <-ctx.Done():

		rt.CircuitBreaker.RecordFailure()
		metrics.IncrementFailure()

		rt.SecondaryProxy.ServeHTTP(w, r)
	}
}