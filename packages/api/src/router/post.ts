import { desc, schema } from "@repo/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.post.findMany({
      orderBy: desc(schema.post.id),
    });
  }),
});
