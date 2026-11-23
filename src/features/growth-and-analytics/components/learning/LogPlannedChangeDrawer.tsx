import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { showToast } from "@/shared/utils/showToast";

import {
  CHANGE_CATEGORY_LABEL,
  CHANGE_TEXTAREA_CLASS,
} from "../../constants/learning/campaignChanges";
import type { CampaignChangeCategory } from "../../types/types";

type LogPlannedChangeDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
};

const CATEGORIES = Object.keys(CHANGE_CATEGORY_LABEL) as CampaignChangeCategory[];

export function LogPlannedChangeDrawer({
  open,
  onOpenChange,
  campaignName,
}: LogPlannedChangeDrawerProps) {
  const [level, setLevel] = useState("campaign");
  const [changeType, setChangeType] = useState("Daily budget");
  const [newValue, setNewValue] = useState("");
  const [category, setCategory] = useState<CampaignChangeCategory>("budget");
  const [reason, setReason] = useState("");

  function handleSave() {
    if (reason.trim().length < 10) {
      showToast("error", "Reason needs at least 10 characters.");
      return;
    }
    showToast("info", "UI only — planned change will save when logic ships.");
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>Log a planned change</SheetTitle>
          <SheetDescription>
            {campaignName} · log before editing Meta / Google
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="plan-level">Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="plan-level" className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="adset">Ad set / Ad group</SelectItem>
                <SelectItem value="ad">Ad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-type">Change type</Label>
            <Input
              id="plan-type"
              value={changeType}
              onChange={(event) => setChangeType(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-value">New value</Label>
            <Input
              id="plan-value"
              value={newValue}
              onChange={(event) => setNewValue(event.target.value)}
              placeholder="e.g. ₹1,500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as CampaignChangeCategory)
              }
            >
              <SelectTrigger id="plan-category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((key) => (
                  <SelectItem key={key} value={key}>
                    {CHANGE_CATEGORY_LABEL[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-reason">Reason</Label>
            <textarea
              id="plan-reason"
              className={CHANGE_TEXTAREA_CLASS}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Why you plan to make this change"
            />
          </div>
        </div>

        <SheetFooter className="border-t border-border sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="rounded-full" onClick={handleSave}>
            Save plan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
