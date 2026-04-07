"use client";

import { useState, useTransition, type ReactElement, type ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type ConfirmDangerAlertDialogProps = {
  trigger: ReactElement;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  pendingConfirmLabel?: string;
  cancelLabel?: string;
  /** Return `true` to close the dialog (e.g. after a successful mutation). */
  onConfirm: () => Promise<boolean>;
  contentClassName?: string;
};

export function ConfirmDangerAlertDialog({
  trigger,
  title,
  description,
  confirmLabel,
  pendingConfirmLabel = "Working…",
  cancelLabel = "Cancel",
  onConfirm,
  contentClassName,
}: ConfirmDangerAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const shouldClose = await onConfirm();
      if (shouldClose) {
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className={contentClassName}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? pendingConfirmLabel : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
