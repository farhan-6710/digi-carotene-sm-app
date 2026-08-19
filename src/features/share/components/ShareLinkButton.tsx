import { useState } from "react";
import { Link2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/utils/showToast";

type ShareLinkButtonProps = {
  canShare: boolean;
  onCopy: () => Promise<void>;
};

export function ShareLinkButton({ canShare, onCopy }: ShareLinkButtonProps) {
  const [isCopying, setIsCopying] = useState(false);

  if (!canShare) return null;

  const handleClick = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      await onCopy();
      showToast("success", "Share link copied.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not copy share link.";
      showToast("error", message);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="cursor-pointer rounded-full shadow-sm"
      onClick={() => void handleClick()}
      disabled={isCopying}
    >
      <Link2 className="mr-2 size-4" />
      {isCopying ? "Copying..." : "Copy share link"}
    </Button>
  );
}
