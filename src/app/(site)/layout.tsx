import { currentUser } from "@clerk/nextjs/server";

import { SiteHeader } from "@/components/layouts/site-header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <main className="relative">
      <SiteHeader user={user} />
      <section className="pt-36">{children}</section>
    </main>
  );
}
