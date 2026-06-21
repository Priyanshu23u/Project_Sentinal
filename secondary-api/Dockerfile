FROM golang:1.26 AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o secondary .

FROM alpine:latest

WORKDIR /root

COPY --from=builder /app/secondary .

EXPOSE 8082

CMD ["./secondary"]