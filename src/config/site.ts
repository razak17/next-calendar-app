import type { NavItem } from "@/types";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Calendar App",
  description:
    "A simple and efficient calendar app that helps you manage your events, meetings, and schedules with ease. Stay organized and never miss an important date again!",
  url: "https://g-client.vercel.app",
  mainNav: [
    {
      imgURL: "/assets/events.svg",
      route: "/events",
      label: "My Events",
    },
    {
      imgURL: "/assets/schedule.svg",
      route: "/schedule",
      label: "My Schedule",
    },
    {
      imgURL: "/assets/public.svg",
      route: "/book",
      label: "Public Profile",
    },
  ] satisfies NavItem[],
};
