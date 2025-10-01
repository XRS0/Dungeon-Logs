from __future__ import annotations

import re
from typing import Optional

from fastapi import HTTPException

from .models import LogSummaryRequest
from .prompt_builder import build_messages
from llm_client import LLMClient
from config import RESPONSE_FORMAT


class LogSummaryService:

    def __init__(self, client: Optional[LLMClient] = None):
        self.client = client or LLMClient()

    def summarize(self, payload: LogSummaryRequest) -> dict:
        messages = build_messages(payload)
        try:
            content = self.client.query_with_messages(messages)
        except Exception as exc:  
            raise HTTPException(status_code=502, detail=f"LLM backend error: {exc}") from exc

        content = re.sub(r'\s*<think>.*?</think>\s*', '', content, flags=re.DOTALL)
        content = content.strip()

        response = {"summary": content}
        if RESPONSE_FORMAT != "plain":
            response["prompt_messages"] = messages
        return response
