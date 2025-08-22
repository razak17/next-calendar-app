"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Loading from "@/components/loading";

export default function PublicPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!user) {
    return redirect("/login");
  }

  return redirect(`/book/${user.id}`);
}
