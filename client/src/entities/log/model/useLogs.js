import { useInfiniteQuery } from "@tanstack/react-query";
import { logsService } from "../api/getLogs";

export const useLogs = (page) => {
  return useInfiniteQuery({
    queryKey: ["logs", "infinite"],
    queryFn: () => logsService.getLogs(page),
  });
};