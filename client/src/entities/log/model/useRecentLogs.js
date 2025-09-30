import { useQuery } from "@tanstack/react-query";
import { getRecentLogs } from "~entities/log/api/getRecentLogs";

export const LOG_QUERY_KEY = ["recent-logs"];

export const useRecentLogs = () => {
  return useQuery({
    queryKey: LOG_QUERY_KEY,
    queryFn: getRecentLogs,
    refetchInterval: 1000 * 60 * 5
  });
};
