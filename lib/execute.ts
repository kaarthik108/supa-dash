// import { db } from "./db";
// import { getDb } from "./db";

export async function _runQuery(query: string) {
  // const db = await getDb();
  // const result = await db.execute(sql`${sql.raw(query)}`);
  console.log("Query:", query);

  // Check if we are in a production-like environment with a 'Result' object
  // if ("rows" in result) {
  //   console.log("Query result (Production):", result);
  //   const data = result.rows;
  //   const columns = result.fields.map((field) => field.name); // Assuming 'fields' is always present in this case
  //   return { columns, data };
  // } else {
  //   // We are in development, handling the direct array result
  //   const data = result;
  //   // This assumes that the structure of objects in the result array is consistent,
  //   // and that using the keys from the first object to determine the column names is accurate.
  //   const columns = result.length > 0 ? Object.keys(result[0]) : [];
  //   return { columns, data };
  // }
}
