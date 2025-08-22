"use client";

import {
  SignedIn,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import type { NavItem } from "@/types";
import { Button } from "../ui/button";

interface MainNavProps {
  user: User | null;
  items?: NavItem[];
}

export function MainNav({ user, items }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`fixed z-50 flex h-28 w-full items-center justify-between gap-4 bg-gray-300 px-10 shadow-2xl ${user ? "mb-28" : ""}`}
    >
      <Link
        href="/events"
        className="flex items-center gap-1 duration-500 hover:scale-120"
      >
        <Image
          src="/assets/logo.svg"
          width={60}
          height={60}
          alt="calendra logo"
        />
      </Link>

      <section className="sticky top-0 flex justify-between text-black">
        {user ? (
          <div className="flex flex-1 max-sm:gap-0 sm:gap-6">
            {items?.map((item) => {
              const isActive =
                pathname === item.route ||
                pathname.startsWith(`${item.route}/`);

              return (
                <Link
                  href={item.route}
                  key={item.label}
                  className={cn(
                    "flex items-center justify-start gap-4 rounded-lg p-4 duration-300 hover:scale-150",
                    isActive && "rounded-3xl bg-blue-100",
                  )}
                >
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={30}
                    height={30}
                  />

                  <p className={cn("font-semibold text-lg max-lg:hidden")}>
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-1 max-sm:gap-0 sm:gap-6">
            <SignInButton>
              <Button className="cursor-pointer rounded-2xl border border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white shadow-2xl duration-500 hover:scale-150 hover:bg-blue-700">
                Login
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                className="cursor-pointer rounded-2xl border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow-2xl duration-500 hover:scale-150 hover:bg-gray-100"
                variant={"outline"}
              >
                Register
              </Button>
            </SignUpButton>
          </div>
        )}
      </section>

      {user && (
        <div className="duration-500 hover:scale-150">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
