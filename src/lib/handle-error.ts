import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import * as z from "zod";

export const unknownError =
  "An unknown error occurred. Please try again later.";

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    return err?.message ?? unknownError;
  } else if (isClerkAPIResponseError(err)) {
    return err.errors[0]?.longMessage ?? unknownError;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}
