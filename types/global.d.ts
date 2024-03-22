import type { Database as DB } from "./database.types";

declare global {
  type Database = DB;
  type subscribers = DB["public"]["Tables"]["subscriber"]["Row"];
  type campaigns = DB["public"]["Tables"]["campaign"]["Row"];
}
