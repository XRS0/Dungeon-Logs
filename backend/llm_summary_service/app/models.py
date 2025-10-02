from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime
from statistics import mean
from typing import Any, Dict, List

from pydantic import BaseModel, Field


class NotableMessage(BaseModel):
    timestamp: datetime
    level: str
    message: str


class LogEntrySummary(BaseModel):
    started_at: datetime
    finished_at: datetime
    duration_seconds: float = Field(gt=0)
    total_entries: int = Field(ge=0)
    level_counts: Dict[str, int] = Field(default_factory=dict)
    notable_messages: List[NotableMessage] = Field(default_factory=list)
    metadata_samples: Dict[str, Any] = Field(default_factory=dict)


class LogSummaryRequest(BaseModel):
    logs: List[LogEntrySummary] = Field(min_length=1)

    def as_prompt_sections(self) -> Dict[str, object]:
        first_started = min(log.started_at for log in self.logs)
        last_finished = max(log.finished_at for log in self.logs)
        total_duration = sum(log.duration_seconds for log in self.logs)
        avg_duration = mean(log.duration_seconds for log in self.logs)
        total_entries = sum(log.total_entries for log in self.logs)

        level_counter: Counter[str] = Counter()
        for log in self.logs:
            for level, count in log.level_counts.items():
                if isinstance(count, (int, float)):
                    level_counter[level] += int(count)

        level_stats = dict(sorted(level_counter.items(), key=lambda item: item[1], reverse=True))

        severity_order = {"critical": 0, "error": 1, "warn": 2, "warning": 2, "info": 3, "debug": 4, "trace": 5}
        all_messages: List[Dict[str, Any]] = []
        for idx, log in enumerate(self.logs, start=1):
            for message in log.notable_messages:
                all_messages.append(
                    {
                        "log_index": idx,
                        "timestamp": message.timestamp.isoformat(),
                        "level": message.level,
                        "message": message.message,
                    }
                )

        def sort_key(item: Dict[str, Any]) -> tuple[int, str]:
            level = str(item.get("level", "info")).lower()
            return (severity_order.get(level, 99), item.get("timestamp", ""))

        notable_messages = sorted(all_messages, key=sort_key)[:10]

        metadata_pool: defaultdict[str, List[Any]] = defaultdict(list)
        for log in self.logs:
            for key, value in log.metadata_samples.items():
                bucket = metadata_pool[key]
                if value not in bucket:
                    bucket.append(value)

        metadata_samples: Dict[str, Any] = {}
        for key, values in metadata_pool.items():
            metadata_samples[key] = values[0] if len(values) == 1 else values[:3]

        return {
            "Сводка пакета": {
                "batch_size": len(self.logs),
                "earliest_started_at": first_started.isoformat(),
                "latest_finished_at": last_finished.isoformat(),
                "total_duration_seconds": round(total_duration, 6),
                "average_duration_seconds": round(avg_duration, 6),
                "total_entries": total_entries,
            },
            "Статистика уровней": level_stats,
            "Заметные сообщения": notable_messages,
            "Метаданные": metadata_samples,
        }
