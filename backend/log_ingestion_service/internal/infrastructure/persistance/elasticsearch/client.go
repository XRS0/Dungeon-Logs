package elasticsearch

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"log_ingestion_service/config"

	esv8 "github.com/elastic/go-elasticsearch/v8"
)

// Client wraps the official Elasticsearch client and exposes helpers for other components.
type Client struct {
	es *esv8.Client
}

func NewClient(cfg config.Config_ES) (*Client, error) {
	if strings.TrimSpace(cfg.Address) == "" {
		return nil, fmt.Errorf("elasticsearch: address is required")
	}

	clientCfg := esv8.Config{
		Addresses: []string{cfg.Address},
		Username:  strings.TrimSpace(cfg.Username),
		Password:  cfg.Password,
	}

	esClient, err := esv8.NewClient(clientCfg)
	if err != nil {
		return nil, fmt.Errorf("elasticsearch: create client: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := esClient.Info(esClient.Info.WithContext(ctx))
	if err != nil {
		return nil, fmt.Errorf("elasticsearch: info request failed: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		body, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf("elasticsearch: info request error: %s %s", res.Status(), strings.TrimSpace(string(body)))
	}

	return &Client{es: esClient}, nil
}

func (c *Client) Native() *esv8.Client {
	return c.es
}
