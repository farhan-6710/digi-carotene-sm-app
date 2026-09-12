import { useEffect, useState } from "react";

import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";
import { formFieldClassName } from "@/shared/constants/formStyles";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { ClientCombobox } from "@/features/clients-management/components/ClientCombobox";
import { PasswordInput } from "@/shared/ui/PasswordInput";

import { GrowthAdsPlatformToggle } from "../GrowthAdsPlatformToggle";
import { GrowthStaticComboBox } from "../GrowthStaticComboBox";
import { currencyOptions } from "../../constants/accountsData";
import type { AdAccountDialogProps } from "../../types/components";

export function AdAccountDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: AdAccountDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isGoogle = values.platform === "google_ads";

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSaveMeta =
    values.clientId.trim() !== "" &&
    values.accountName.trim() !== "" &&
    values.adAccountId.trim() !== "" &&
    (isEditing || values.accessToken.trim() !== "");

  const canSaveGoogle =
    values.clientId.trim() !== "" &&
    values.accountName.trim() !== "" &&
    values.adAccountId.trim() !== "" &&
    values.loginCustomerId.trim() !== "" &&
    (isEditing ||
      (values.developerToken.trim() !== "" &&
        values.oauthClientId.trim() !== "" &&
        values.oauthClientSecret.trim() !== "" &&
        values.oauthRefreshToken.trim() !== ""));

  const canSave = isGoogle ? canSaveGoogle : canSaveMeta;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {isEditing ? "Edit Ad Account" : "Connect Ad Account"}
            </DialogTitle>
            <DialogDescription>
              {isGoogle
                ? "Link a Google Ads customer account under Digi Carotene’s manager account."
                : "Link a Meta ad account to pull paid campaign performance."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            {!isEditing ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Platform
                </p>
                <GrowthAdsPlatformToggle
                  value={values.platform}
                  onChange={(platform) => onFieldChange("platform", platform)}
                />
              </div>
            ) : null}

            <label className="block text-xs font-semibold text-muted-foreground">
              Client
              <div className="mt-2">
                <ClientCombobox
                  value={values.clientId}
                  onChange={(clientId) => onFieldChange("clientId", clientId)}
                  placeholder="Select the client this ad account belongs to"
                  seedClient={
                    values.clientId
                      ? { id: values.clientId, client_name: values.clientName }
                      : null
                  }
                />
              </div>
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Ad account name
              <input
                value={values.accountName}
                onChange={(event) =>
                  onFieldChange("accountName", event.target.value)
                }
                placeholder={
                  isGoogle
                    ? "e.g. Armario Pro — Google Ads"
                    : "e.g. Armario Pro — Ads"
                }
                className={formFieldClassName}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              {isGoogle ? "Customer ID" : "Ad account ID"}
              <input
                value={values.adAccountId}
                onChange={(event) =>
                  onFieldChange("adAccountId", event.target.value)
                }
                placeholder={
                  isGoogle ? "e.g. 123-456-7890" : "e.g. act_1234567890"
                }
                className={formFieldClassName}
              />
            </label>

            {isGoogle ? (
              <label className="block text-xs font-semibold text-muted-foreground">
                Manager (login) Customer ID
                <input
                  value={values.loginCustomerId}
                  onChange={(event) =>
                    onFieldChange("loginCustomerId", event.target.value)
                  }
                  placeholder="Digi Carotene MCC id, e.g. 987-654-3210"
                  className={formFieldClassName}
                />
              </label>
            ) : null}

            <GrowthStaticComboBox
              label="Currency"
              value={values.currencyCode}
              options={currencyOptions}
              onChange={(value) => onFieldChange("currencyCode", value)}
              placeholder="Select currency"
            />

            {isGoogle ? (
              <>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Developer token
                  <PasswordInput
                    value={values.developerToken}
                    onChange={(event) =>
                      onFieldChange("developerToken", event.target.value)
                    }
                    placeholder={
                      isEditing
                        ? "Paste to refresh Google Ads API access"
                        : "From Google Ads API Center"
                    }
                    className={formFieldClassName}
                    containerClassName="mt-1"
                  />
                </label>

                <label className="block text-xs font-semibold text-muted-foreground">
                  OAuth client ID
                  <PasswordInput
                    value={values.oauthClientId}
                    onChange={(event) =>
                      onFieldChange("oauthClientId", event.target.value)
                    }
                    placeholder={
                      isEditing
                        ? "Paste to refresh OAuth client ID"
                        : "From Google Cloud Console"
                    }
                    className={formFieldClassName}
                    containerClassName="mt-1"
                  />
                </label>

                <label className="block text-xs font-semibold text-muted-foreground">
                  OAuth client secret
                  <PasswordInput
                    value={values.oauthClientSecret}
                    onChange={(event) =>
                      onFieldChange("oauthClientSecret", event.target.value)
                    }
                    placeholder={
                      isEditing
                        ? "Paste to refresh OAuth client secret"
                        : "From Google Cloud Console"
                    }
                    className={formFieldClassName}
                    containerClassName="mt-1"
                  />
                </label>

                <label className="block text-xs font-semibold text-muted-foreground">
                  OAuth refresh token
                  <PasswordInput
                    value={values.oauthRefreshToken}
                    onChange={(event) =>
                      onFieldChange("oauthRefreshToken", event.target.value)
                    }
                    placeholder={
                      isEditing
                        ? "Paste to refresh OAuth refresh token"
                        : "Authorized with adwords scope"
                    }
                    className={formFieldClassName}
                    containerClassName="mt-1"
                  />
                </label>
              </>
            ) : (
              <label className="block text-xs font-semibold text-muted-foreground">
                Access token
                <PasswordInput
                  value={values.accessToken}
                  onChange={(event) =>
                    onFieldChange("accessToken", event.target.value)
                  }
                  placeholder={
                    isEditing
                      ? "Paste a new token to refresh from Meta"
                      : "Paste the system user access token"
                  }
                  className={formFieldClassName}
                  containerClassName="mt-1"
                />
              </label>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive-outline"
                onClick={() => setIsConfirmOpen(true)}
                className="mr-auto"
                disabled={isSaving}
              >
                Remove Account
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={onSave}
              disabled={!canSave || isSaving}
              className="rounded-full"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Connect Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove ad account?"
        description="This removes the ad account and its campaign metrics from the dashboards."
        confirmLabel="Remove account"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          await onDelete?.();
          setIsConfirmOpen(false);
        }}
      />
    </>
  );
}
