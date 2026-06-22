import { useState, type FormEvent } from "react";

import { STAFF_SIGNUP_ACCESS_CODE } from "@/features/auth/constants/auth";
import type { StaffAccessCodeModalProps } from "@/features/auth/types/components";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function StaffAccessCodeModal({ open, onVerified }: StaffAccessCodeModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (code !== STAFF_SIGNUP_ACCESS_CODE) {
      setError("Incorrect access code. Contact your Digi Carotene admin.");
      return;
    }

    onVerified();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Staff access required</DialogTitle>
          <DialogDescription>
            Enter the staff signup code to create a team account. Client signups
            do not require a code.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-access-code">Access code</Label>
            <Input
              id="staff-access-code"
              type="password"
              autoComplete="off"
              placeholder="Enter staff code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
