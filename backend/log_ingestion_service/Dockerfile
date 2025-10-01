# syntax=docker/dockerfile:1

FROM golang:1.23 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/log-ingestion-service ./cmd/service

FROM alpine:3.20
RUN apk add --no-cache ca-certificates \
	&& addgroup -S app \
	&& adduser -S app -G app

WORKDIR /app
COPY --from=builder /out/log-ingestion-service /usr/local/bin/service

USER app
CMD ["service"]
