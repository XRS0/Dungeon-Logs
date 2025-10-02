import { useQuery } from "@tanstack/react-query";
import { logsService } from "../api/getRecentLogs";

export const useLogs = (page) => {
  return useQuery({
    queryKey: ["logs", { page }],
    queryFn: () => logsService.getLogs(page),
  });
};
