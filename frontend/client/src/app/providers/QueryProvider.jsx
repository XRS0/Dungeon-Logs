import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });

export const QueryProvider = ({ children }) => {
  const [client] = useState(createQueryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
