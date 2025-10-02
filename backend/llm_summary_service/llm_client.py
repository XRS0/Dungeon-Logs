import json
import re
from typing import List

import requests
from openai import OpenAI
from config import (
    MODEL_PROVIDER,
    OPENAI_API_KEY,
    OLLAMA_MODEL,
    NOVITA_API_KEY,
    NOVITA_MODEL,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL
)

NOVITA_BASE_URL = "https://api.novita.ai/v3/openai"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

class LLMClient:

    def __init__(self, provider: str | None = None):
        self.provider = provider or MODEL_PROVIDER
        if self.provider == 'openAI':
            if not OPENAI_API_KEY:
                raise RuntimeError("OPENAI_API_KEY is not set")
            self.client = OpenAI(api_key=OPENAI_API_KEY)
        elif self.provider == 'novita':
            if not NOVITA_API_KEY:
                raise RuntimeError("NOVITA_API_KEY is not set")
            self.client = OpenAI(
                api_key=NOVITA_API_KEY,
                base_url=NOVITA_BASE_URL
            )
        elif self.provider == 'openrouter':
            if not OPENROUTER_API_KEY:
                raise RuntimeError("OPENROUTER_API_KEY is not set")
            self.client = OpenAI(
                api_key=OPENROUTER_API_KEY,
                base_url=OPENROUTER_BASE_URL
            )
        elif self.provider == 'ollama':
            self.client = None
        elif self.provider == 'stub':
            self.client = None

    def query_with_messages(self, messages):
        if self.provider == 'openAI':
            return self.query_openai_with_messages(messages)
        elif self.provider == 'ollama':
            return self.query_ollama_with_messages(messages)
        elif self.provider == 'novita':
            return self.query_novita_with_messages(messages)
        elif self.provider == 'openrouter':
            return self.query_openrouter_with_messages(messages)
        elif self.provider == 'stub':
            return self.query_stub_with_messages(messages)
        else:
            raise ValueError("Unsupported model provider")

    def query_openai_with_messages(self, messages):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=512,
        )
        return response.choices[0].message.content

    def query_ollama_with_messages(self, messages):
        try:
            response = requests.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "messages": messages,
                    "stream": False
                },
                timeout=150
            )
            response.raise_for_status()
            return response.json()["message"]["content"]
        except requests.exceptions.RequestException as e:
            return f"Ошибка при обращении к Ollama API: {e}"

    def query_novita_with_messages(self, messages):
        response = self.client.chat.completions.create(
            model=NOVITA_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=512
        )
        return response.choices[0].message.content

    def query_openrouter_with_messages(self, messages):
        response = self.client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=messages,
            temperature=0.7,
        )
        return response.choices[0].message.content

    def query_stub_with_messages(self, messages):
        """Return a deterministic offline summary for development."""
        user_content = next(
            (item["content"] for item in reversed(messages) if item.get("role") == "user"),
            "",
        )

        pattern = re.compile(r"## (?P<title>.+?)\n(?P<body>(?:\{.*?\}|\[.*?\]))(?=\n\n## |$)", re.S)
        highlights: List[str] = []
        for match in pattern.finditer(user_content):
            title = match.group("title")
            body = match.group("body")
            try:
                data = json.loads(body)
            except json.JSONDecodeError:
                continue
            highlight = self._highlight_section(title, data)
            if highlight:
                highlights.append(f"- {title}: {highlight}")

        if not highlights:
            highlights.append("- Данных недостаточно для офлайн-сводки. Проверьте входной payload.")

        return (
            "Режим stub: LLM не вызван. Черновая аналитика на основе входных данных:\n"
            + "\n".join(highlights)
        )

    def _highlight_section(self, title: str, data) -> str:
        if title == "Сводка пакета" and isinstance(data, dict):
            duration = data.get("total_duration_seconds")
            batch = data.get("batch_size")
            entries = data.get("total_entries")
            return f"батч={batch}, длительность={duration}s, записей={entries}"
        if title == "Статистика уровней" and isinstance(data, dict):
            if not data:
                return "уровни не указаны"
            top_level = max(data.items(), key=lambda item: item[1])
            total = sum(v for v in data.values() if isinstance(v, (int, float)))
            return f"пик={top_level[0]}({top_level[1]}), всего={total}"
        if title == "Заметные сообщения" and isinstance(data, list):
            error_messages = [item for item in data if isinstance(item, dict) and item.get("level") == "error"]
            sample = error_messages[0]["message"] if error_messages else (data[0].get("message") if data and isinstance(data[0], dict) else None)
            count = len(data)
            detail = f"пример='{sample}'" if sample else "пример отсутствует"
            return f"сообщений={count}, {detail}"
        if title == "Метаданные" and isinstance(data, dict):
            keys_sample = ", ".join(list(data.keys())[:3])
            return f"ключи={keys_sample}" if keys_sample else "метаданные пусты"
        return ""
