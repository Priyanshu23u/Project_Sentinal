package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"backend/internal/circuitbreaker"
	"backend/internal/metrics"

	"github.com/gorilla/websocket"
)

type Hub struct {
	CircuitBreaker *circuitbreaker.CircuitBreaker
}

func NewHub(cb *circuitbreaker.CircuitBreaker) *Hub {
	return &Hub{
		CircuitBreaker: cb,
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type DashboardData struct {
	RPS          int64  `json:"rps"`
	Success      int64  `json:"success"`
	Failure      int64  `json:"failure"`
	ActiveRoutes int64  `json:"activeRoutes"`
	CircuitState string `json:"circuitState"`
}

func (h *Hub) HandleWS(w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	defer conn.Close()

	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {

		<-ticker.C

		m := metrics.GetMetrics()

		payload := DashboardData{
			RPS:          m.RPS,
			Success:      m.Success,
			Failure:      m.Failure,
			ActiveRoutes: m.ActiveRoutes,
			CircuitState: string(h.CircuitBreaker.GetState()),
		}

		data, _ := json.Marshal(payload)

		err := conn.WriteMessage(
			websocket.TextMessage,
			data,
		)

		if err != nil {
			break
		}
	}
}