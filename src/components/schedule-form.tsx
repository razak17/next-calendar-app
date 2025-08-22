"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Fragment } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { saveSchedule } from "@/lib/actions/schedule";
import { DAYS_OF_WEEK_IN_ORDER } from "@/lib/constants";
import { formatTimezoneOffset } from "@/lib/format";
import { getErrorMessage } from "@/lib/handle-error";
import { timeToFloat } from "@/lib/utils";
import { scheduleFormSchema } from "@/lib/validations/schedule";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Availability = {
  startTime: string;
  endTime: string;
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
};

export function ScheduleForm({
  schedule,
}: {
  schedule?: {
    timezone: string;
    availabilities: Availability[];
  };
}) {
  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone:
        schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities.toSorted((a, b) => {
        return timeToFloat(a.startTime) - timeToFloat(b.startTime);
      }),
    },
  });

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({ name: "availabilities", control: form.control });

  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (availability) => availability.dayOfWeek,
  );

  async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
    try {
      await saveSchedule(values);
      toast("Schedule saved successfully.", {
        duration: 5000,
        className:
          "!rounded-3xl !py-8 !px-5 !justify-center !text-green-400 !font-black",
      });
    } catch (error) {
      form.setError("root", {
        message: `There was an error saving your schedule${getErrorMessage(error)}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Intl.supportedValuesOf("timeZone").map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                      {` (${formatTimezoneOffset(timezone)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-[auto_auto] gap-y-6">
          {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => (
            <Fragment key={dayOfWeek}>
              <div className="font-semibold text-sm capitalize">
                {dayOfWeek.substring(0, 3)}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  className="size-6 cursor-pointer p-1 hover:scale-200"
                  variant="outline"
                  onClick={() => {
                    addAvailability({
                      dayOfWeek,
                      startTime: "9:00",
                      endTime: "17:00",
                    });
                  }}
                >
                  <Plus color="red" />
                </Button>

                {groupedAvailabilityFields[dayOfWeek]?.map(
                  (field, labelIndex) => (
                    <div className="flex flex-col gap-1" key={field.id}>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-24"
                                  aria-label={`${dayOfWeek} Start Time ${
                                    labelIndex + 1
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        -
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-24"
                                  aria-label={`${dayOfWeek} End Time ${
                                    labelIndex + 1
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          className="size-6 cursor-pointer p-1 hover:bg-red-900"
                          variant="destructive"
                          onClick={() => removeAvailability(field.index)}
                        >
                          <X />
                        </Button>
                      </div>

                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index,
                          )?.root?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index,
                          )?.startTime?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index,
                          )?.endTime?.message
                        }
                      </FormMessage>
                    </div>
                  ),
                )}
              </div>
            </Fragment>
          ))}
        </div>

        <div className="flex justify-start gap-2">
          <Button
            className="cursor-pointer bg-blue-400 hover:scale-105 hover:bg-blue-600"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
