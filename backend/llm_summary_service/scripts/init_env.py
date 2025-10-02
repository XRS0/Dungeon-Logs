from __future__ import annotations

from pathlib import Path

ENV_TEMPLATE = """MODEL_PROVIDER=ollama
RESPONSE_FORMAT=plain

OPENAI_API_KEY=

NOVITA_API_KEY=
NOVITA_MODEL=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=

OLLAMA_MODEL=qwen3:1.7b
"""


def write_env_file(path: Path) -> None:
    path.write_text(ENV_TEMPLATE, encoding="utf-8")


def main() -> None:
    env_path = Path(__file__).resolve().parent.parent / ".env"
    write_env_file(env_path)
    print(f".env updated at {env_path}")


if __name__ == "__main__":
    main()
