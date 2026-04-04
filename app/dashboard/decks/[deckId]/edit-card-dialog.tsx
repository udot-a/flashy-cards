"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateCardAction } from "./actions";
import { FormTextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { CardFormValues } from "@/interfaces/card-form.interface";
import type { EditCardDialogProps } from "@/interfaces/edit-card-dialog.interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cardFormSchema } from "@/lib/validation/cards";

export function EditCardDialog({
  deckId,
  cardId,
  defaultFront,
  defaultBack,
}: EditCardDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      front: defaultFront,
      back: defaultBack,
    },
  });

  const { reset, handleSubmit, control } = form;

  useEffect(() => {
    if (open) {
      reset({
        front: defaultFront,
        back: defaultBack,
      });
    }
  }, [open, defaultFront, defaultBack, reset]);

  function onSubmit(values: CardFormValues) {
    startTransition(async () => {
      const result = await updateCardAction({
        deckId,
        cardId,
        ...values,
      });
      if (result.ok) {
        toast.success("Card updated", {
          description: "Your changes have been saved.",
        });
        setOpen(false);
        router.refresh();
        return;
      }
      toast.error("Couldn't update card", {
        description: result.message,
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" type="button" className="w-full">
          <SquarePen data-icon="inline-start" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit card</DialogTitle>
              <DialogDescription>
                Update the front and back of this flashcard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormTextareaField
                control={control}
                name="front"
                label="Front"
                maxLength={5000}
                rows={4}
                disabled={isPending}
              />
              <FormTextareaField
                control={control}
                name="back"
                label="Back"
                maxLength={5000}
                rows={4}
                disabled={isPending}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
