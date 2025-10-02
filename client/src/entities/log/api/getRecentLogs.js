import { axiosInstance } from "../../axios/instance";

const SAMPLE_LOGS = [
  {
    id: "evt-8675309",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    level: "error",
    source: "auth-service",
    message: "Spike of 401 responses detected",
    meta: "31 событий за 5 минут"
  },
  {
    id: "evt-8675310",
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    level: "warning",
    source: "scheduler",
    message: "Очередь #23 превышает порог времени ожидания",
    meta: "Задержка 4м 11с"
  },
  {
    id: "evt-8675311",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    level: "info",
    source: "notifications",
    message: "Рассылка #442 завершена успешно",
    meta: "487 успешных доставок"
  },
  {
    id: "evt-8675312",
    timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    level: "warning",
    source: "etl-pipeline",
    message: "Увеличение задержки в шаге нормализации",
    meta: "+38% к среднему времени"
  }
];

export const getRecentLogs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return SAMPLE_LOGS;
};

class LogsService {
  async getLogs(page) {
    await new Promise(res => setTimeout(res, 200));
    return [...SAMPLE_LOGS, ...SAMPLE_LOGS, ...SAMPLE_LOGS];
    // return axiosInstance.get("/logs", {
    //   params: {
    //     page,
    //     // limit: 10,
    //     // search: 'john',
    //     // sort: 'name',
    //   }
    // });
  }
}

export const logsService = new LogsService();

