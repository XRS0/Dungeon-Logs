from __future__ import annotations

from fastapi import Depends, FastAPI

from .models import LogSummaryRequest
from .service import LogSummaryService


app = FastAPI(title="LLM Log Summary Service", version="0.1.0")


def get_service() -> LogSummaryService:
    return LogSummaryService()


@app.get("/health", tags=["system"])
def healthcheck() -> dict:
    return {"status": "ok"}


@app.post("/v1/log-summary", tags=["summary"])
def summarize_logs(
    payload: LogSummaryRequest,
    service: LogSummaryService = Depends(get_service),
) -> dict:
    return service.summarize(payload)
