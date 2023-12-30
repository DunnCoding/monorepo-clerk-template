import { auth } from "@clerk/nextjs";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@repo/api";
import { db } from "@repo/db";

export const runtime = "edge";

function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
}

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      auth: auth(),
      db,
    }),
    onError({ error, path }) {
      console.error({ error, path });
    },
  });

  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
