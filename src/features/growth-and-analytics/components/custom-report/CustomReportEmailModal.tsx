import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { isValidEmail } from "../../utils/customReportPeriod";

type CustomReportEmailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSending: boolean;
  onSend: (emails: string[]) => Promise<void>;
};

export function CustomReportEmailModal({
  open,
  onOpenChange,
  isSending,
  onSend,
}: CustomReportEmailModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addEmail = () => {
    const next = draft.trim().toLowerCase();
    if (!next) return;
    if (!isValidEmail(next)) {
      setError("Enter a valid email address.");
      return;
    }
    if (emails.includes(next)) {
      setDraft("");
      setError(null);
      return;
    }
    if (emails.length >= 10) {
      setError("You can send to at most 10 emails.");
      return;
    }
    setEmails((prev) => [...prev, next]);
    setDraft("");
    setError(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addEmail();
    }
  };

  const handleSend = async () => {
    if (emails.length === 0) {
      setError("Add at least one email.");
      return;
    }
    setError(null);
    await onSend(emails);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSending) return;
        if (!next) {
          setDraft("");
          setError(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email report PDF</DialogTitle>
          <DialogDescription>
            Add one or more recipients. Each will receive the generated PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="name@company.com"
              disabled={isSending}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addEmail}
              disabled={isSending}
            >
              Add
            </Button>
          </div>

          {emails.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs"
                >
                  {email}
                  <button
                    type="button"
                    className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                    disabled={isSending}
                    onClick={() =>
                      setEmails((prev) => prev.filter((item) => item !== email))
                    }
                    aria-label={`Remove ${email}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No recipients yet. Type an email and press Enter or Add.
            </p>
          )}

          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={isSending} onClick={() => void handleSend()}>
            {isSending ? "Sending…" : "Send PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
