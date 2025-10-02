import { useQuery } from "@tanstack/react-query";
import { getRunLogs } from "~entities/run/api";

export const RUN_LOGS_QUERY_KEY = (runId) => ["run-logs", runId];

export const useRunLogs = (runId, options = {}) =>
  useQuery({
    queryKey: RUN_LOGS_QUERY_KEY(runId),
    queryFn: () => getRunLogs(runId),
    enabled: Boolean(runId),
    ...options
  });
