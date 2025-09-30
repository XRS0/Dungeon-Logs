import { useQuery } from "@tanstack/react-query";

import { getSystemStatus } from "~entities/system/api/getSystemStatus";

export const SYSTEM_STATUS_QUERY_KEY = ["system-status"];

export const useSystemStatus = () =>
  useQuery({
    queryKey: SYSTEM_STATUS_QUERY_KEY,
    queryFn: getSystemStatus,
    refetchInterval: 1000 * 60
  });
