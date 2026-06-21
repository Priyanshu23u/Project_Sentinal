FROM golang:1.26 AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o primary .

FROM alpine:latest

WORKDIR /root

COPY --from=builder /app/primary .

EXPOSE 8081

CMD ["./primary"]