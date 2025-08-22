import { auth } from "@clerk/nextjs/server";

import { getSchedule } from "@/lib/queries/schedule";

import { ScheduleForm } from "@/components/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SchedulePage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const schedule = await getSchedule(userId);

  return (
    <Card className="mx-auto max-w-md border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
      <CardHeader>
        <CardTitle>Schedule</CardTitle> {}
      </CardHeader>
      <CardContent>
        <ScheduleForm schedule={schedule} />
      </CardContent>
    </Card>
  );
}
