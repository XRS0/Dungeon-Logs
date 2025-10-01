import { useQuery } from "@tanstack/react-query";
import { getIncidents } from "~entities/incident/api/getIncidents";

export const INCIDENTS_QUERY_KEY = ["incidents"];

export const useIncidents = () =>
  useQuery({
    queryKey: INCIDENTS_QUERY_KEY,
    queryFn: getIncidents
  });
