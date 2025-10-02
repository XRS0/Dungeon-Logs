import { useQuery } from "@tanstack/react-query";
import { getRunTimeline } from "~entities/run/api";

export const RUN_TIMELINE_QUERY_KEY = (runId) => ["run-timeline", runId];

export const useRunTimeline = (runId, options = {}) =>
  useQuery({
    queryKey: RUN_TIMELINE_QUERY_KEY(runId),
    queryFn: () => getRunTimeline(runId),
    enabled: Boolean(runId),
    ...options
  });
