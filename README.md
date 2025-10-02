## Запуск backend части

Backend проекта состоит из нескольких микросервисов (log-ingestion-service, log-generator-service, llm-summary-service), а также зависимостей вроде RabbitMQ, Elasticsearch и PostgreSQL. Все они запускаются с помощью Docker Compose.

Чтобы запустить backend запустите все сервисы с помощью Docker Compose:
   ```
   docker-compose up --build -d
   ```

Эта команда соберет образы для сервисов и запустит все контейнеры. Сервисы будут доступны на указанных портах (например, RabbitMQ на 15672, Elasticsearch на 9200, LLM Summary Service на 8000 и т.д). Обратите внимание, что для корректной работы могут потребоваться дополнительные настройки переменных окружения, такие как ключи для RabbitMQ, Elasticsearch и PostgreSQL. Убедитесь, что Docker имеет достаточно ресурсов для запуска всех контейнеров.