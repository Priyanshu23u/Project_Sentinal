package main

import (
	"encoding/json"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"source":  "SECONDARY",
		"message": "Fallback API",
	})
}

func main() {
	http.HandleFunc("/", handler)

	http.ListenAndServe(":8082", nil)
}