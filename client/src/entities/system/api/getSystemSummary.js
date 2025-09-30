const insights = [
  {
    id: "insight-1",
    title: "Пиковая нагрузка",
    detail: "Поток запросов +42% к среднему в течение последнего часа",
    impact: "high"
  },
  {
    id: "insight-2",
    title: "Логистика уведомлений",
    detail: "85% пушей дошли до абонентов, конверсия открытий +7%",
    impact: "medium"
  },
  {
    id: "insight-3",
    title: "Ошибки интеграции",
    detail: "4 партнёрских API ответили с 429, автоматика перераспределила поток",
    impact: "low"
  }
];

export const getSystemSummary = async () => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return insights;
};
