import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";

import { getEvents } from "@/lib/queries/event";

import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";

export default async function EventsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const events = await getEvents(userId);

  return (
    <section className="flex animate-fade-in flex-col items-center gap-16">
      <div className="flex items-baseline gap-4">
        <h1 className="mb-6 font-black text-4xl xl:text-5xl">Events</h1>
        <Button
          className="rounded-2xl border-blue-700 border-b-4 bg-blue-500 py-6 font-black text-2xl text-white shadow-accent-foreground duration-500 hover:scale-110 hover:border-blue-500 hover:bg-blue-400"
          asChild
        >
          <Link href="/events/new">
            <CalendarPlus className="mr-4 size-7" /> Create Event
          </Link>
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-10 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <CalendarRange className="mx-auto size-16 text-black" />
          You do not have any events yet. Create your first event to get
          started!
          <Button
            className="rounded-2xl border-blue-700 border-b-4 bg-blue-500 py-6 font-black text-2xl text-white shadow-2xl shadow-accent-foreground duration-500 hover:scale-110 hover:border-blue-500 hover:bg-blue-400"
            asChild
          >
            <Link href="/events/new">
              <CalendarPlus className="mr-4 size-7" /> New Event
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
