"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteDeckAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDangerAlertDialog } from "@/components/ui/confirm-danger-alert-dialog";
import type { DeleteDeckDialogProps } from "@/interfaces/delete-deck.interface";

export function DeleteDeckDialog({ deckId, deckTitle }: DeleteDeckDialogProps) {
  const router = useRouter();

  return (
    <ConfirmDangerAlertDialog
      contentClassName="sm:max-w-md"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={`Delete deck: ${deckTitle}`}
        >
          <Trash2 className="size-4" />
        </Button>
      }
      title="Delete this deck?"
      description={
        <>
          This permanently removes{" "}
          <span className="font-medium text-foreground">{deckTitle}</span> and
          all cards in it. You cannot undo this action.
        </>
      }
      confirmLabel="Delete deck"
      pendingConfirmLabel="Deleting…"
      onConfirm={async () => {
        const result = await deleteDeckAction({ deckId });
        if (result.ok) {
          toast.success("Deck deleted", {
            description: "The deck and its cards were removed.",
          });
          router.refresh();
          return true;
        }
        toast.error("Couldn't delete deck", {
          description: result.message,
        });
        return false;
      }}
    />
  );
}
