import { useQuery } from "@tanstack/react-query";
import { getRunSessionById } from "~entities/run/api";

export const RUN_SESSION_QUERY_KEY = (runId) => ["run-session", runId];

export const useRunDetails = (runId, options = {}) =>
  useQuery({
    queryKey: RUN_SESSION_QUERY_KEY(runId),
    queryFn: () => getRunSessionById(runId),
    enabled: Boolean(runId),
    ...options
  });
