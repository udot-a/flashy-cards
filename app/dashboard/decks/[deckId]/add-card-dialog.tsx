"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createCardAction } from "./actions";
import { FormTextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { AddCardDialogProps } from "@/interfaces/add-card-dialog.interface";
import type { CardFormValues } from "@/interfaces/card-form.interface";
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

const emptyValues: CardFormValues = { front: "", back: "" };

export function AddCardDialog({ deckId }: AddCardDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: emptyValues,
  });

  const { reset, handleSubmit, control } = form;

  useEffect(() => {
    if (open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  function onSubmit(values: CardFormValues) {
    startTransition(async () => {
      const result = await createCardAction({
        deckId,
        ...values,
      });
      if (result.ok) {
        toast.success("Card added", {
          description: "Your new card is in this deck.",
        });
        setOpen(false);
        router.refresh();
        return;
      }
      toast.error("Couldn't add card", {
        description: result.message,
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="default"
          type="button"
          className="w-full sm:w-auto"
        >
          <Plus data-icon="inline-start" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add card</DialogTitle>
              <DialogDescription>
                Enter the front and back of the flashcard. You can edit it
                later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormTextareaField
                control={control}
                name="front"
                label="Front"
                maxLength={5000}
                rows={4}
                placeholder="Question or prompt"
                disabled={isPending}
              />
              <FormTextareaField
                control={control}
                name="back"
                label="Back"
                maxLength={5000}
                rows={4}
                placeholder="Answer"
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
                {isPending ? "Adding…" : "Add card"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
