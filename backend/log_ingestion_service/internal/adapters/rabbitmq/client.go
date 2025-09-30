package rabbitmq

import (
	"context"
	"errors"
	"fmt"
	"log_ingestion_service/config"
	"sync"

	amqp "github.com/rabbitmq/amqp091-go"
)

// Client manages the lifecycle of a RabbitMQ connection and exposes helper methods
// that are convenient for the ingestion layer.
type Client struct {
	conn    *amqp.Connection
	channel *amqp.Channel

	cfg config.Config_RMQ
	mu  sync.RWMutex
}

// NewClient establishes a connection to RabbitMQ and prepares a channel.
func NewClient(cfg config.Config_RMQ) (*Client, error) {
	if cfg.URL == "" {
		return nil, errors.New("rabbitmq: empty connection URL")
	}

	if cfg.Prefetch <= 0 {
		cfg.Prefetch = 1
	}

	conn, err := amqp.Dial(cfg.URL)
	if err != nil {
		return nil, fmt.Errorf("rabbitmq: dial failed: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		_ = conn.Close()
		return nil, fmt.Errorf("rabbitmq: create channel failed: %w", err)
	}

	if err := channel.Qos(cfg.Prefetch, 0, false); err != nil {
		_ = channel.Close()
		_ = conn.Close()
		return nil, fmt.Errorf("rabbitmq: set qos failed: %w", err)
	}

	return &Client{
		conn:    conn,
		channel: channel,
		cfg:     cfg,
	}, nil
}

// DeclareQueue creates the queue if it does not exist yet. It is safe to call this
// multiple times; RabbitMQ will ensure idempotency.
func (c *Client) DeclareQueue(name string, durable bool) (amqp.Queue, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if c.channel == nil {
		return amqp.Queue{}, errors.New("rabbitmq: channel is not initialized")
	}

	queue, err := c.channel.QueueDeclare(
		name,
		durable, // durable
		false,   // auto-delete
		false,   // exclusive
		false,   // no-wait
		nil,     // args
	)
	if err != nil {
		return amqp.Queue{}, fmt.Errorf("rabbitmq: declare queue %s failed: %w", name, err)
	}

	return queue, nil
}

// Consume subscribes to the provided queue and returns a delivery channel. The subscription
// is automatically cancelled when the provided context is cancelled.
func (c *Client) Consume(ctx context.Context, queueName, consumerTag string) (<-chan amqp.Delivery, error) {
	c.mu.RLock()
	channel := c.channel
	c.mu.RUnlock()

	if channel == nil {
		return nil, errors.New("rabbitmq: channel is not initialized")
	}

	deliveries, err := channel.Consume(
		queueName,
		consumerTag,
		false, // autoAck
		false, // exclusive
		false, // noLocal - RabbitMQ server does not support this flag but library requires it
		false, // noWait
		nil,   // args
	)
	if err != nil {
		return nil, fmt.Errorf("rabbitmq: consume from %s failed: %w", queueName, err)
	}

	go func() {
		<-ctx.Done()
		_ = channel.Cancel(consumerTag, false)
	}()

	return deliveries, nil
}

// Ack acknowledges a message as successfully processed.
func (c *Client) Ack(delivery amqp.Delivery) error {
	return delivery.Ack(false)
}

// Nack negatively acknowledges a message and optionally requeues it.
func (c *Client) Nack(delivery amqp.Delivery, requeue bool) error {
	return delivery.Nack(false, requeue)
}

// Close shuts down the channel and connection.
func (c *Client) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	var firstErr error
	if c.channel != nil {
		if err := c.channel.Close(); err != nil && !errors.Is(err, amqp.ErrClosed) {
			firstErr = err
		}
		c.channel = nil
	}

	if c.conn != nil {
		if err := c.conn.Close(); err != nil && !errors.Is(err, amqp.ErrClosed) && firstErr == nil {
			firstErr = err
		}
		c.conn = nil
	}

	return firstErr
}
