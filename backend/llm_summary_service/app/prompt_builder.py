from __future__ import annotations

import json
from typing import List

from .models import LogSummaryRequest

SYSTEM_PROMPT = (
    "Ты — эксперт по Terraform. Твоя задача — проанализировать логи выполнения Terraform и написать понятный отчёт для человека.\n\n"
    "Структура отчёта:\n\n"
    "## Ключевые события\n"
    "- Расскажи, что произошло: фазы plan/apply, сколько времени заняло, основные результаты.\n\n"
    "## Риски и проблемы\n"
    "- Выдели ошибки, предупреждения и потенциальные проблемы.\n\n"
    "## Рекомендации\n"
    "- Дай советы, как улучшить процесс или избежать проблем в будущем.\n\n"
    "Пиши простым языком, используй списки и короткие параграфы. Избегай технического жаргона без объяснения."
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
