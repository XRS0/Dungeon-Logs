package config

import (
	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	RMQ  Config_RMQ
	HTTP Config_HTTP
	DB   Config_DB
	ES   Config_ES
}

type Config_RMQ struct {
	URL          string `env:"RMQ_URL" env-required:"true"`
	SummaryQueue string `env:"RMQ_SUMMARY_QUEUE" env-default:"llm_summary"`
}

type Config_HTTP struct {
	Address        string `env:"HTTP_ADDRESS" env-default:"0.0.0.0:8080"`
	MaxUploadBytes int64  `env:"HTTP_MAX_UPLOAD_BYTES" env-default:"10485760"`
}

type Config_DB struct {
	Host     string `env:"DB_HOST" env-default:"postgres"`
	Port     int    `env:"DB_PORT" env-default:"5432"`
	User     string `env:"DB_USER" env-default:"postgres"`
	Password string `env:"DB_PASSWORD" env-default:"postgres"`
	Name     string `env:"DB_NAME" env-default:"terraform_logs"`
	SSLMode  string `env:"DB_SSLMODE" env-default:"disable"`
}

type Config_ES struct {
	Address  string `env:"ES_ADDRESS" env-default:"http://localhost:9200"`
	Username string `env:"ES_USERNAME"`
	Password string `env:"ES_PASSWORD"`
	Index    string `env:"ES_INDEX" env-default:"terraform_logs"`
}

func InitConfig() Config {
	var cfg Config
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		panic(err)
	}

	return cfg
}
