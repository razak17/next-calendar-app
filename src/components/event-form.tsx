"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { createEvent, deleteEvent, updateEvent } from "@/lib/actions/event";
import { getErrorMessage } from "@/lib/handle-error";
import { type EventFormSchema, eventFormSchema } from "@/lib/validations/event";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

export default function EventForm({
  event,
}: {
  event?: {
    id: string;
    name: string;
    description?: string;
    durationInMinutes: number;
    isActive: boolean;
  };
}) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const router = useRouter();

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name ?? "",
      description: event?.description ?? "",
      isActive: event?.isActive ?? true,
      durationInMinutes: event?.durationInMinutes ?? 30,
    },
  });

  async function onSubmit(values: EventFormSchema) {
    const action =
      event == null ? createEvent : updateEvent.bind(null, event.id);
    try {
      await action(values);
      router.push("/events");
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The name users will see when booking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationInMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>In minutes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="h-32 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Optional description of the event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Active</FormLabel>
              </div>
              <FormDescription>
                Inactive events will not be visible for users to book
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {event && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="cursor-pointer hover:scale-105 hover:bg-red-700"
                  variant="destructive"
                  disabled={isDeletePending || form.formState.isSubmitting}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this event.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer bg-red-500 hover:bg-red-700"
                    disabled={isDeletePending || form.formState.isSubmitting}
                    onClick={() => {
                      startDeleteTransition(async () => {
                        try {
                          await deleteEvent(event.id);
                          router.push("/events");
                        } catch (error) {
                          form.setError("root", {
                            message: `There was an error deleting your event: ${getErrorMessage(error)}`,
                          });
                        }
                      });
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            disabled={isDeletePending || form.formState.isSubmitting}
            type="button"
            asChild
            variant="outline"
          >
            <Link href="/events">Cancel</Link>
          </Button>

          <Button
            className="cursor-pointer bg-blue-400 hover:scale-105 hover:bg-blue-600"
            disabled={isDeletePending || form.formState.isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
