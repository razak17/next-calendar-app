import Link from "next/link";

import { formatEventDescription } from "@/lib/format";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PublicEventCardProps = {
  id: string;
  name: string;
  clerkUserId: string;
  description: string | null;
  durationInMinutes: number;
};

export default function PublicEventCard({
  id,
  name,
  description,
  clerkUserId,
  durationInMinutes,
}: PublicEventCardProps) {
  return (
    <Card className="hover:-translate-y-1 flex flex-col border-4 border-blue-500/10 shadow-2xl transition delay-150 duration-300 ease-in-out hover:scale-110">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}{" "}
        </CardDescription>
      </CardHeader>
      {description && <CardContent>{description}</CardContent>}
      <CardFooter className="mt-auto flex justify-end gap-2">
        <Button
          className="cursor-pointer bg-blue-400 hover:scale-105 hover:bg-blue-600"
          asChild
        >
          <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
