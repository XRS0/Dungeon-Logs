package config

import (
	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	RMQ Config_RMQ
}

type Config_RMQ struct {
	URL      string
	Queue    string
	Consumer string
	Prefetch int
}

func InitConfig() Config {
	var cfg Config
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		panic(err)
	}

	return cfg
}
