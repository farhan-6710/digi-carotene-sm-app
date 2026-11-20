import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  CHANGE_CATEGORY_LABEL,
  CHANGE_RANGE_OPTIONS,
  CHANGE_VERIFICATION_LABEL,
} from "../../constants/learning/campaignChanges";
import type {
  CampaignChangeCategory,
  CampaignChangeVerification,
} from "../../types/types";

type CampaignChangesFiltersProps = {
  range: string;
  category: string;
  status: string;
  madeBy: string;
  onRangeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMadeByChange: (value: string) => void;
  onLogPlanned: () => void;
};

const CATEGORIES = Object.keys(CHANGE_CATEGORY_LABEL) as CampaignChangeCategory[];
const STATUSES = Object.keys(
  CHANGE_VERIFICATION_LABEL,
) as CampaignChangeVerification[];

export function CampaignChangesFilters({
  range,
  category,
  status,
  madeBy,
  onRangeChange,
  onCategoryChange,
  onStatusChange,
  onMadeByChange,
  onLogPlanned,
}: CampaignChangesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Select value={range} onValueChange={onRangeChange}>
          <SelectTrigger size="sm" className="min-w-36 rounded-full" aria-label="Date range">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            {CHANGE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger size="sm" className="min-w-40 rounded-full" aria-label="Category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Category: All</SelectItem>
            {CATEGORIES.map((key) => (
              <SelectItem key={key} value={key}>
                {CHANGE_CATEGORY_LABEL[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger size="sm" className="min-w-40 rounded-full" aria-label="Status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            {STATUSES.map((key) => (
              <SelectItem key={key} value={key}>
                {CHANGE_VERIFICATION_LABEL[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={madeBy} onValueChange={onMadeByChange}>
          <SelectTrigger size="sm" className="min-w-36 rounded-full" aria-label="Made by">
            <SelectValue placeholder="Made by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Made by: All</SelectItem>
            <SelectItem value="ravi">Ravi K.</SelectItem>
            <SelectItem value="priya">Priya S.</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="button" className="rounded-full" onClick={onLogPlanned}>
        <Plus className="size-4" />
        Log planned change
      </Button>
    </div>
  );
}
