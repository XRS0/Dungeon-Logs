import { useQuery } from "@tanstack/react-query";

import { getSystemSummary } from "~entities/system/api/getSystemSummary";

export const SYSTEM_SUMMARY_QUERY_KEY = ["system-summary"];

export const useSystemSummary = () =>
  useQuery({
    queryKey: SYSTEM_SUMMARY_QUERY_KEY,
    queryFn: getSystemSummary,
    refetchInterval: 1000 * 60 * 5
  });
