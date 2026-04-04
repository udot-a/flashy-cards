"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateDeckAction } from "./actions";
import { FormTextField, FormTextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { EditDeckDialogProps } from "@/interfaces/edit-deck-dialog.interface";
import type { EditDeckFormValues } from "@/interfaces/edit-deck-form.interface";
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
import { editDeckFormSchema } from "@/lib/validation/decks";

export function EditDeckDialog({
  deckId,
  defaultTitle,
  defaultDescription,
}: EditDeckDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditDeckFormValues>({
    resolver: zodResolver(editDeckFormSchema),
    defaultValues: {
      title: defaultTitle,
      description: defaultDescription?.trim() ?? "",
    },
  });

  const { reset, handleSubmit, control } = form;

  useEffect(() => {
    if (open) {
      reset({
        title: defaultTitle,
        description: defaultDescription?.trim() ?? "",
      });
    }
  }, [open, defaultTitle, defaultDescription, reset]);

  function onSubmit(values: EditDeckFormValues) {
    startTransition(async () => {
      const result = await updateDeckAction({
        deckId,
        ...values,
      });
      if (result.ok) {
        toast.success("Deck updated", {
          description: "Your changes have been saved.",
        });
        setOpen(false);
        router.refresh();
        return;
      }
      toast.error("Couldn't update deck", {
        description: result.message,
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" type="button">
          <SquarePen data-icon="inline-start" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit deck</DialogTitle>
              <DialogDescription>
                Update the deck title and description. Card content is
                unchanged.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormTextField
                control={control}
                name="title"
                label="Title"
                maxLength={200}
                autoComplete="off"
                disabled={isPending}
              />
              <FormTextareaField
                control={control}
                name="description"
                label="Description"
                maxLength={2000}
                rows={4}
                placeholder="Optional"
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
