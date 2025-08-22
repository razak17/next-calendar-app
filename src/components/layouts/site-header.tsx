"use client";

import { MainNav } from "@/components/layouts/main-nav";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps {
  userId?: string;
}

export function SiteHeader({ userId }: SiteHeaderProps) {
  return (
    <header className="w-full">
      <div className="flex h-28 items-center">
        <MainNav userId={userId} items={siteConfig.mainNav} />
      </div>
    </header>
  );
}
