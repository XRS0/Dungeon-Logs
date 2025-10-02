import { useQuery } from "@tanstack/react-query";
import { getRunSessions } from "~entities/run/api";

export const RUN_SESSIONS_QUERY_KEY = ["run-sessions"];

export const useRunSessions = () =>
  useQuery({
    queryKey: RUN_SESSIONS_QUERY_KEY,
    queryFn: getRunSessions
  });
