"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@repo/api";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headersPromise: Promise<Headers>;
}) {
  const [queryClient] = useState(() => {
    return new QueryClient();
  });

  const trpcClient = useState(() => {
    return api.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: "http://localhost:3000/api/trpc",
          async headers() {
            const headers = new Map(await props.headersPromise);
            headers.set("x-trpc-source", "nextjs-react");
            return Object.fromEntries(headers);
          },
        }),
      ],
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

// function getBaseUrl() {
//   if (typeof window !== "undefined") return window.location.origin;
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
//   return `http://localhost:${process.env.PORT ?? 3000}`;
// }
