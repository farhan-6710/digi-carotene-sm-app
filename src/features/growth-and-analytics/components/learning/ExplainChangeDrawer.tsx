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
import type {
  CampaignChangeCategory,
  CampaignChangeRow,
} from "../../types/types";

type ExplainChangeDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: CampaignChangeRow | null;
  campaignName: string;
};

const CATEGORIES = Object.keys(CHANGE_CATEGORY_LABEL) as CampaignChangeCategory[];

export function ExplainChangeDrawer({
  open,
  onOpenChange,
  row,
  campaignName,
}: ExplainChangeDrawerProps) {
  const [category, setCategory] = useState<CampaignChangeCategory>("budget");
  const [reason, setReason] = useState("");
  const [kpi, setKpi] = useState("Cost / conv.");
  const [direction, setDirection] = useState("Down");
  const [byPercent, setByPercent] = useState("25");
  const [withinDays, setWithinDays] = useState("14");

  function handleOpenChange(next: boolean) {
    if (next && row) {
      setCategory(row.category);
      setReason(row.reason ?? "");
    }
    onOpenChange(next);
  }

  function handleSave() {
    if (reason.trim().length < 10) {
      showToast("error", "Reason needs at least 10 characters.");
      return;
    }
    showToast("info", "UI only — explain change will save when logic ships.");
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>Explain a change</SheetTitle>
          <SheetDescription>
            {campaignName}
            {row ? ` · ${row.summary}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="explain-category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as CampaignChangeCategory)
              }
            >
              <SelectTrigger id="explain-category" className="w-full">
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
            <Label htmlFor="explain-reason">Reason</Label>
            <textarea
              id="explain-reason"
              className={CHANGE_TEXTAREA_CLASS}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Why this change was made"
            />
          </div>

          <div className="space-y-3 rounded-xl border border-border p-4">
            <p className="text-sm font-medium text-foreground">
              Expected impact
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="explain-kpi">KPI</Label>
                <Input
                  id="explain-kpi"
                  value={kpi}
                  onChange={(event) => setKpi(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="explain-direction">Direction</Label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger id="explain-direction" className="w-full">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Up">Up</SelectItem>
                    <SelectItem value="Down">Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="explain-by">By %</Label>
                <Input
                  id="explain-by"
                  value={byPercent}
                  onChange={(event) => setByPercent(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="explain-within">Within days</Label>
                <Input
                  id="explain-within"
                  value={withinDays}
                  onChange={(event) => setWithinDays(event.target.value)}
                />
              </div>
            </div>
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
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
