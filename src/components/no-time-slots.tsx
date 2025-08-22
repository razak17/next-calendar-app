import Link from "next/link";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function NoTimeSlots({
  event,
  calendarUser,
}: {
  event: { name: string; description: string | null };
  calendarUser: { id: string; fullName: string | null };
}) {
  return (
    <Card className="hover:-translate-y-1 mx-auto max-w-md border-4 border-blue-500/10 shadow-2xl transition delay-150 duration-500 ease-in-out hover:scale-125">
      <CardHeader>
        <CardTitle>
          Book {event.name} with {calendarUser.fullName}
        </CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {calendarUser.fullName} is currently booked up. Please check back later
        or choose a shorter event.
      </CardContent>
      <CardFooter>
        <Button
          className="cursor-pointer bg-blue-400 hover:scale-105 hover:bg-blue-600"
          asChild
        >
          <Link href={`/book/${calendarUser.id}`}>Choose Another Event</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
