import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  ACCOUNT_PASSWORD_HINT,
  ACCOUNT_PASSWORD_MIN_LENGTH,
} from "@/shared/constants/accountPassword";
import type { AccountPasswordDialogProps } from "@/shared/components/account/types";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { removePasswordLogin, updatePassword } from "@/services/authService";
import { showToast } from "@/shared/utils/showToast";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function AccountPasswordDialog({
  open,
  onOpenChange,
  email,
  isChange,
  canRemove,
}: AccountPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  function resetForm() {
    setPassword("");
    setConfirm("");
    setShowPassword(false);
    setShowConfirm(false);
  }

  async function handleSave() {
    if (password.length < ACCOUNT_PASSWORD_MIN_LENGTH) {
      showToast(
        "error",
        `Password must be at least ${ACCOUNT_PASSWORD_MIN_LENGTH} characters.`,
      );
      return;
    }
    if (password !== confirm) {
      showToast("error", "Passwords do not match.");
      return;
    }

    setIsSaving(true);
    const error = await updatePassword(password);
    setIsSaving(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    showToast(
      "success",
      isChange
        ? "Password updated. You can sign in with your email and this password."
        : "Password set. You can sign in with your email and this password.",
    );
    resetForm();
    onOpenChange(false);
  }

  async function handleRemove() {
    setIsRemoving(true);
    const error = await removePasswordLogin();
    setIsRemoving(false);
    setIsRemoveConfirmOpen(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    showToast(
      "success",
      "Password login removed. You can still sign in with Google or your other connected method.",
    );
    resetForm();
    onOpenChange(false);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            resetForm();
            setIsRemoveConfirmOpen(false);
          }
          onOpenChange(next);
        }}
      >
        <DialogContent className="max-w-md!">
          <DialogHeader>
            <DialogTitle>
              {isChange ? "Change password" : "Set password"}
            </DialogTitle>
            <DialogDescription>
              {ACCOUNT_PASSWORD_HINT}
              {email ? (
                <>
                  {" "}
                  Your email is{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="account-password">New password</Label>
              <div className="relative">
                <Input
                  id="account-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSaving || isRemoving}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-password-confirm">Confirm password</Label>
              <div className="relative">
                <Input
                  id="account-password-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  disabled={isSaving || isRemoving}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {canRemove ? (
              <Button
                type="button"
                variant="destructive-outline"
                className="mr-auto"
                disabled={isSaving || isRemoving}
                onClick={() => setIsRemoveConfirmOpen(true)}
              >
                Remove password
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving || isRemoving}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving || isRemoving || !password || !confirm}
            >
              {isSaving
                ? "Saving..."
                : isChange
                  ? "Update password"
                  : "Set password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isRemoveConfirmOpen}
        onOpenChange={setIsRemoveConfirmOpen}
        title="Remove password login?"
        description="You’ll no longer be able to sign in with email and password. You can still use Google or another connected sign-in method."
        confirmLabel="Remove password"
        confirmVariant="destructive"
        loading={isRemoving}
        onConfirm={handleRemove}
      />
    </>
  );
}
