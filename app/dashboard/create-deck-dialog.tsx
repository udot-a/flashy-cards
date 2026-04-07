"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createDeckAction } from "./actions";
import { FormTextField, FormTextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
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
import { FREE_PLAN_DECK_LIMIT } from "@/lib/billing";

type CreateDeckDialogProps = {
  canCreateDeck?: boolean;
};

export function CreateDeckDialog({
  canCreateDeck = true,
}: CreateDeckDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditDeckFormValues>({
    resolver: zodResolver(editDeckFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { reset, handleSubmit, control } = form;

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        description: "",
      });
    }
  }, [open, reset]);

  if (!canCreateDeck) {
    return (
      <div className="flex max-w-lg flex-col gap-3">
        <Button variant="default" size="lg" type="button" disabled>
          <Plus data-icon="inline-start" />
          Create a New Deck
        </Button>
        <div className="text-sm text-muted-foreground">
          The free plan includes up to {FREE_PLAN_DECK_LIMIT} decks.{" "}
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <Link href="/pricing">Upgrade</Link>
          </Button>{" "}
          for unlimited decks.
        </div>
      </div>
    );
  }

  function onSubmit(values: EditDeckFormValues) {
    startTransition(async () => {
      const result = await createDeckAction(values);
      if (result.ok) {
        toast.success("Deck created", {
          description: "You can add cards next.",
        });
        setOpen(false);
        router.refresh();
        return;
      }
      toast.error("Couldn't create deck", {
        description: result.message,
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" type="button">
          <Plus data-icon="inline-start" />
          Create a New Deck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>New deck</DialogTitle>
              <DialogDescription>
                Give your deck a title and optional description. You can add
                cards after it is created.
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
                {isPending ? "Creating…" : "Create deck"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
