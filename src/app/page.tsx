import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import LandingPage from "@/components/layouts/landing-page";

export default async function Home() {
  const user = await currentUser();

  if (!user) return <LandingPage />;

  return redirect("/events");
}
