package metrics

import (
	"sync/atomic"
)

type Metrics struct {
	RPS          int64
	Success      int64
	Failure      int64
	ActiveRoutes int64
}

var GlobalMetrics Metrics

func IncrementRPS() {
	atomic.AddInt64(&GlobalMetrics.RPS, 1)
}

func IncrementSuccess() {
	atomic.AddInt64(&GlobalMetrics.Success, 1)
}

func IncrementFailure() {
	atomic.AddInt64(&GlobalMetrics.Failure, 1)
}

func IncrementActiveRoutes() {
	atomic.AddInt64(&GlobalMetrics.ActiveRoutes, 1)
}

func DecrementActiveRoutes() {
	atomic.AddInt64(&GlobalMetrics.ActiveRoutes, -1)
}

func GetMetrics() Metrics {
	return Metrics{
		RPS:          atomic.LoadInt64(&GlobalMetrics.RPS),
		Success:      atomic.LoadInt64(&GlobalMetrics.Success),
		Failure:      atomic.LoadInt64(&GlobalMetrics.Failure),
		ActiveRoutes: atomic.LoadInt64(&GlobalMetrics.ActiveRoutes),
	}
}