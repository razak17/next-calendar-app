"use client";

import type { VariantProps } from "class-variance-authority";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "./ui/button";

type CopyState = "idle" | "copied" | "error";

interface CopyEventButtonProps
  extends Omit<React.ComponentProps<"button">, "children" | "onClick">,
    VariantProps<typeof buttonVariants> {
  eventId: string;
  clerkUserId: string;
}

function getCopyLabel(state: CopyState) {
  switch (state) {
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
    case "idle":
      return "Copy Link";
    default:
      return "Copy Link";
  }
}

export function CopyEventButton({
  eventId,
  clerkUserId,
  className,
  variant,
  size,
  ...props
}: CopyEventButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = () => {
    const url = `${location.origin}/book/${clerkUserId}/${eventId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyState("copied");
        toast("Link copied successfully.", {
          duration: 3000,
        });
        setTimeout(() => setCopyState("idle"), 2000);
      })
      .catch(() => {
        setCopyState("error");
        setTimeout(() => setCopyState("idle"), 2000);
      });
  };

  return (
    <Button
      onClick={handleCopy}
      className={cn(
        buttonVariants({ variant, size }),
        "cursor-pointer",
        className,
      )}
      variant={variant}
      size={size}
      {...props}
    >
      <CopyIcon className="mr-2 size-4" /> {}
      {getCopyLabel(copyState)} {}
    </Button>
  );
}
