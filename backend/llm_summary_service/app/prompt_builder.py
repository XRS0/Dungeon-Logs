from __future__ import annotations

import json
from typing import List

from .models import LogSummaryRequest

SYSTEM_PROMPT = (
    "Ты — эксперт по Terraform. Твоя задача — проанализировать агрегированные сводки логов Terraform и сформировать компактный отчёт.\n\n"
    "Формат ответа строго следующий:\n"
    "1) Первый абзац: 2–3 предложения, кратко описывающих ключевую картину по всем логам (тайминг, масштабы, общие тенденции).\n"
    "2) Затем список из ровно двух пунктов `-`, где ты фиксируешь самые значимые риски/наблюдения. Каждый пункт не длиннее одного предложения.\n"
    "3) Второй абзац: 2–3 предложения с рекомендациями или следующими шагами.\n\n"
    "Принципы обработки данных:\n"
    "- Используй только факты из переданного контекста; если информации не хватает, прямо скажи \"Нет данных\".\n"
    "- Не придумывай дополнительные параметры и не домысливай причины, оставляя их как гипотезы.\n"
    "- Упоминай уровни логов и временные промежутки только если они присутствуют в данных.\n"
    "- Предпочитай ясный, разговорный русский без перегруза терминами."
)


def build_messages(payload: LogSummaryRequest) -> List[dict]:
    sections = []
    for section_name, data in payload.as_prompt_sections().items():
        if not data:
            continue
        rendered = json.dumps(data, ensure_ascii=False, indent=2, default=str)
        sections.append(f"## {section_name}\n{rendered}")

    user_prompt = "На основе следующих данных логов Terraform сгенерируй системный отчёт согласно инструкциям:\n\n" + "\n\n".join(sections)

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]
