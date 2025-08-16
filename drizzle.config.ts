import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.log('🔴 Cannot find database url');
}

export default defineConfig({
  schema: './src/lib/supabase/schema.ts',
  dialect:"postgresql",
  out: './migrations',
  // driver: 'pg',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
})



// import { defineConfig } from "drizzle-kit";
// export default defineConfig({
//   dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
//   schema: "./src/schema.ts",
//   out: "./drizzle",
// });