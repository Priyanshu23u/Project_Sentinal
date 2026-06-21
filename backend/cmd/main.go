package main

import (
	"backend/internal/circuitbreaker"
	"backend/internal/proxy"
	ws "backend/internal/websocket"
	"log"
	"net/http"
)

func main() {

	cb := circuitbreaker.NewCircuitBreaker()

	router := proxy.NewRouter(cb)

	hub := ws.NewHub(cb)

	http.Handle("/", router)

	http.HandleFunc("/ws", hub.HandleWS)

	log.Println("API Multiplexer running on :8080")

	log.Fatal(
		http.ListenAndServe(":8080", nil),
	)
}