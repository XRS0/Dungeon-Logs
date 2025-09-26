import requests
import openai
import openai
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

    def __init__(self):
        if MODEL_PROVIDER == 'openAI':
            openai.api_key = OPENAI_API_KEY
        elif MODEL_PROVIDER == 'novita':
            self.client = OpenAI(
                api_key=NOVITA_API_KEY,
                base_url=NOVITA_BASE_URL
            )
        elif MODEL_PROVIDER == 'openrouter':
            self.client = OpenAI(
                api_key=OPENROUTER_API_KEY,
                base_url=OPENROUTER_BASE_URL
            )

    def query_with_messages(self, messages):
        if MODEL_PROVIDER == 'openAI':
            return self.query_openai_with_messages(messages)
        elif MODEL_PROVIDER == 'ollama':
            return self.query_ollama_with_messages(messages)
        elif MODEL_PROVIDER == 'novita':
            return self.query_novita_with_messages(messages)
        elif MODEL_PROVIDER == 'openrouter':
            return self.query_openrouter_with_messages(messages)
        else:
            raise ValueError("Unsupported model provider")

    def query_openai_with_messages(self, messages):
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
        )
        return response.choices[0].message['content']

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
            extra_headers={}
        )
        return response.choices[0].message.content
