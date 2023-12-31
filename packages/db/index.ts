import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as post from "./schema/post";

export const schema = { ...post };

export { mySqlTable as tableCreater } from "./schema/_table";

export * from "drizzle-orm";

export const db = drizzle(
  new Client({
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }).connection(),
  { schema },
);
