import os
from functools import lru_cache
from typing import Literal

from dotenv import load_dotenv

load_dotenv()

ModelProvider = Literal["openAI", "ollama", "novita", "openrouter", "stub"]


@lru_cache()
def _env(key: str, default: str = "") -> str:
    return os.environ.get(key, default)


MODEL_PROVIDER: ModelProvider = _env("MODEL_PROVIDER", "stub")  
OPENAI_API_KEY: str = _env("OPENAI_API_KEY")
OLLAMA_MODEL: str = _env("OLLAMA_MODEL", "llama3.1")
NOVITA_API_KEY: str = _env("NOVITA_API_KEY")
NOVITA_MODEL: str = _env("NOVITA_MODEL", "gpt-4o-mini")
OPENROUTER_API_KEY: str = _env("OPENROUTER_API_KEY")
OPENROUTER_MODEL: str = _env("OPENROUTER_MODEL", "openrouter/auto")

RESPONSE_FORMAT: str = _env("RESPONSE_FORMAT", "diagnostic")
