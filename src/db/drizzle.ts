import { neon } from "@neondatabase/serverless";

import * as schema from "@/db/schema";
import { env } from "@/env.js";
import "dotenv/config";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";

export const sql = neon(env.DATABASE_URL);

export const db = drizzleNeon(sql, { schema, logger: false });
