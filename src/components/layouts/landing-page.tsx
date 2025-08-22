"use client";

import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="flex h-dvh animate-fade-in items-center gap-24 p-10 max-md:flex-col">
      <section className="flex flex-col items-center">
        <Image src="/assets/logo.svg" width={300} height={300} alt="Logo" />

        <h1 className="font-black text-2xl lg:text-3xl">
          Your time, perfectly planned
        </h1>

        <p className="font-extralight">
          Join millions of professionals who easily book meetings with the #1
          scheduling tool
        </p>

        <Image src="/assets/planning.svg" width={500} height={500} alt="Logo" />
      </section>

      <div className="mt-3">
        <SignIn
          routing="hash" // Keeps sign-in UI on the same page using hash-based routing
          appearance={{
            baseTheme: neobrutalism,
          }}
        />
      </div>
    </main>
  );
}
