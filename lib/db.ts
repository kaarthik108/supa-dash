import { sql as _sql } from "@vercel/postgres";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/vercel-postgres";

const db = drizzle(_sql);

export async function runQuery(query: string) {
  const result = await db.execute(sql`${sql.raw(query)}`);

  const data = result.rows;

  const columns = result.fields.map((field) => field.name);

  const formattedResult = {
    columns,
    data,
  };

  return formattedResult;
}

// async function testCurrentDate() {
//   const result = await runQuery("SELECT CURRENT_DATE");
//   console.log("Formatted Result:", result);
//   return result;
// }

// testCurrentDate();
