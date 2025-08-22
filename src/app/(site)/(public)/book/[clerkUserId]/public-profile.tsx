"use client";

import { useUser } from "@clerk/nextjs";
import { Copy, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getPublicEvents, type PublicEvent } from "@/lib/queries/event";

import PublicEventCard from "./public-event-card";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";

type PublicProfileProps = {
  userId: string;
  fullName: string | null;
};

export default function PublicProfile({
  userId,
  fullName,
}: PublicProfileProps) {
  const [events, setEvents] = useState<PublicEvent[] | null>(null);
  const { user } = useUser();

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/book/${userId}`,
      );
      toast("Profile URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getPublicEvents(userId);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [userId]);

  if (events === null) {
    return (
      <div className="mx-auto max-w-5xl text-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-5">
      {user?.id === userId && (
        <div className="mb-4 flex items-center gap-2 font-bold text-muted-foreground text-sm">
          <Eye className="h-4 w-4" />
          <p>This is how people will see your public profile</p>
        </div>
      )}

      <div className="mb-4 text-center font-black text-4xl md:text-5xl">
        {fullName}
      </div>

      {user?.id === userId && (
        <div className="mb-6 flex justify-center">
          <Button
            className="cursor-pointer"
            variant={"outline"}
            onClick={copyProfileUrl}
          >
            <Copy className="size-4" />
            Copy Public Profile URL
          </Button>
        </div>
      )}

      <div className="mx-auto mb-6 max-w-sm text-center text-muted-foreground">
        <p className="font-bold text-2xl">Time to meet!🧑‍🤝‍🧑</p>
        <br /> Pick an event and let’s make it official by booking a time.
      </div>

      {events.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No events available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {events.map((event) => (
            <PublicEventCard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
}
