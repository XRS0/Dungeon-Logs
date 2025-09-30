const payload = {
  metrics: [
    {
      label: "Uptime",
      value: "99.98%",
      delta: { value: "+0.03%", trend: "up" },
      tone: "positive"
    },
    {
      label: "API latency",
      value: "182 ms",
      delta: { value: "+31 ms", trend: "down" },
      tone: "warning"
    },
    {
      label: "Active incidents",
      value: "02",
      delta: { value: "-1", trend: "up" },
      tone: "positive"
    },
    {
      label: "Error budget",
      value: "72%",
      delta: { value: "-5%", trend: "down" },
      tone: "critical"
    }
  ],
  signals: [
    {
      id: "sig-001",
      title: "Рост 5xx на auth-service",
      status: "attention",
      description: "Пороги предупреждения достигнуты, анализ триггеров в работе",
      updatedAt: new Date(Date.now() - 1000 * 45).toISOString()
    },
    {
      id: "sig-002",
      title: "Плановое окно обновления",
      status: "ok",
      description: "Окно развертывания #4 завершено успешно",
      updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
    }
  ]
};

export const getSystemStatus = async () => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return payload;
};
