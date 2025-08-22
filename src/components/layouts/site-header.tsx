import type { User } from "@clerk/nextjs/server";

import { MainNav } from "@/components/layouts/main-nav";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps {
  user: User | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav user={user} items={siteConfig.mainNav} />
      </div>
    </header>
  );
}
