"use client";

import { MainNav } from "@/components/layouts/main-nav";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps {
  userId?: string;
}

export function SiteHeader({ userId }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav userId={userId} items={siteConfig.mainNav} />
      </div>
    </header>
  );
}
