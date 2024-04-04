import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

let client: Client | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export async function runQuery(query: string) {
  if (!client) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    db = drizzle(client);
  }

  const result = await db!.execute(sql`${sql.raw(query)}`);

  const data = result.rows;
  console.log("Data:", data);

  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
  const formattedResult = {
    columns,
    data,
  };

  return formattedResult;
}

// async function testCurrentDate() {
//   const result = await runQuery("SELECT CURRENT_DATE");
//   console.log("Current date:", result);
//   return result;
// }

// testCurrentDate();
