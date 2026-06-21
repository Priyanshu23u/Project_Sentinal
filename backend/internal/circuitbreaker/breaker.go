package circuitbreaker

import (
	"sync"
	"time"
)

type State string

const (
	Closed   State = "CLOSED"
	Open     State = "OPEN"
	HalfOpen State = "HALF_OPEN"
)

type CircuitBreaker struct {
	mu sync.RWMutex

	state State

	failureCount int

	failureThreshold int

	openTimeout time.Duration

	lastFailureTime time.Time
}

func NewCircuitBreaker() *CircuitBreaker {
	return &CircuitBreaker{
		state:            Closed,
		failureThreshold: 5,
		openTimeout:      10 * time.Second,
	}
}

// Returns current state
func (cb *CircuitBreaker) GetState() State {
	cb.mu.RLock()
	defer cb.mu.RUnlock()

	return cb.state
}

// Called when request succeeds
func (cb *CircuitBreaker) RecordSuccess() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.failureCount = 0

	if cb.state == HalfOpen {
		cb.state = Closed
	}
}

// Called when request fails
func (cb *CircuitBreaker) RecordFailure() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.failureCount++

	if cb.failureCount >= cb.failureThreshold {
		cb.state = Open
		cb.lastFailureTime = time.Now()
	}
}

// Determines whether request should go to primary API
func (cb *CircuitBreaker) AllowRequest() bool {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	if cb.state == Open {

		// Move to HALF_OPEN after timeout
		if time.Since(cb.lastFailureTime) > cb.openTimeout {
			cb.state = HalfOpen
			return true
		}

		return false
	}

	return true
}