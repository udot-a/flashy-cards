"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteCardAction } from "./actions";
import { Button } from "@/components/ui/button";
import { ConfirmDangerAlertDialog } from "@/components/ui/confirm-danger-alert-dialog";
import type { DeleteCardDialogProps } from "@/interfaces/delete-card-dialog.interface";

export function DeleteCardDialog({ deckId, cardId }: DeleteCardDialogProps) {
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
          aria-label="Delete card"
        >
          <Trash2 className="size-4" />
        </Button>
      }
      title="Delete this card?"
      description="This permanently removes the card from your deck. You cannot undo this action."
      confirmLabel="Delete card"
      pendingConfirmLabel="Deleting…"
      onConfirm={async () => {
        const result = await deleteCardAction({ deckId, cardId });
        if (result.ok) {
          toast.success("Card deleted", {
            description: "This card was removed from the deck.",
          });
          router.refresh();
          return true;
        }
        toast.error("Couldn't delete card", {
          description: result.message,
        });
        return false;
      }}
    />
  );
}
