import { redirect } from "next/navigation";

export default async function Home({ params }: { params: { month: string } }) {
  redirect("/dashboard/?month=all");
}
