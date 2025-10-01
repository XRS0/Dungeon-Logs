const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const RUN_TIMELINES = {
  "run-042": [
    { id: "t1", label: "Init", status: "done", durationMinutes: 2, details: "Backend и модули инициализированы" },
    { id: "t2", label: "Plan", status: "done", durationMinutes: 5, details: "Изменений к добавлению: 2, модификаций: 1" },
    { id: "t3", label: "Apply", status: "done", durationMinutes: 7, details: "Все ресурсы применены успешно" }
  ],
  "run-043": [
    { id: "t1", label: "Init", status: "done", durationMinutes: 1, details: "Рабочая директория подготовлена" },
    { id: "t2", label: "Plan", status: "in-progress", durationMinutes: 3, details: "Сравнение с состоянием S3-бэкенда" }
  ],
  "run-041": [
    { id: "t1", label: "Init", status: "done", durationMinutes: 2, details: "Загружены переменные окружения" },
    { id: "t2", label: "Plan", status: "done", durationMinutes: 6, details: "Выявлены модификации сетевых правил" },
    { id: "t3", label: "Apply", status: "failed", durationMinutes: 13, details: "Недостаточно прав для обновления SG-421" }
  ]
};

export const getRunTimeline = async (runId) => {
  await delay();
  return RUN_TIMELINES[runId] ?? [];
};
