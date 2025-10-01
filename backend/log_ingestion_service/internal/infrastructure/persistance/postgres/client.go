package postgres

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"log_ingestion_service/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Client manages access to the PostgreSQL database using a pgx connection pool.
type Client struct {
	pool *pgxpool.Pool
}

func NewClient(ctx context.Context, cfg config.Config_DB) (*Client, error) {
	connString, err := buildConnectionString(cfg)
	if err != nil {
		return nil, err
	}

	poolCfg, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return nil, fmt.Errorf("postgres: parse config: %w", err)
	}

	poolCfg.MaxConnLifetime = 30 * time.Minute
	poolCfg.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, poolCfg)
	if err != nil {
		return nil, fmt.Errorf("postgres: init pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("postgres: ping: %w", err)
	}

	return &Client{pool: pool}, nil
}

func (c *Client) Close() {
	if c.pool != nil {
		c.pool.Close()
	}
}

func (c *Client) Pool() *pgxpool.Pool {
	return c.pool
}

func buildConnectionString(cfg config.Config_DB) (string, error) {
	if cfg.Host == "" {
		return "", fmt.Errorf("postgres: host is required")
	}
	if cfg.User == "" {
		return "", fmt.Errorf("postgres: user is required")
	}
	if cfg.Name == "" {
		return "", fmt.Errorf("postgres: database name is required")
	}

	u := &url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(cfg.User, cfg.Password),
		Host:   fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Path:   cfg.Name,
	}

	query := url.Values{}
	if cfg.SSLMode != "" {
		query.Set("sslmode", cfg.SSLMode)
	}

	u.RawQuery = query.Encode()

	return u.String(), nil
}
