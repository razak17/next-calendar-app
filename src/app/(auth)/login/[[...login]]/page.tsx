import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex animate-fade-in flex-col items-center gap-10 p-5">
      <Image src="/assets/logo.svg" width={100} height={100} alt="Logo" />

      <div className="mt-4">
        <SignIn />
      </div>
    </main>
  );
}
