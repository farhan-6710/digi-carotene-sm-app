import { useMemo } from "react";

import {
  POST_STATUS_SELECT_LABELS,
  POST_STATUS_SELECT_OPTIONS,
  type PostStatusSelectId,
} from "@/features/posts-management/constants/postStatusSelect";
import { ComboBox } from "@/shared/ui/ComboBox";

type PostStatusSelectProps = {
  value: PostStatusSelectId;
  onChange: (value: PostStatusSelectId) => void;
  disabled?: boolean;
};

export function PostStatusSelect({
  value,
  onChange,
  disabled = false,
}: PostStatusSelectProps) {
  const options = useMemo(
    () =>
      POST_STATUS_SELECT_OPTIONS.map((filter) => ({
        value: filter,
        label: POST_STATUS_SELECT_LABELS[filter],
      })),
    [],
  );

  return (
    <div className="w-full min-w-0 space-y-2 sm:w-[160px]">
      <span className="block text-xs font-semibold text-muted-foreground">
        Status
      </span>
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) {
            onChange(next as PostStatusSelectId);
          }
        }}
        options={options}
        disabled={disabled}
        placeholder="All Posts"
        listTitle="Filter posts"
        mode="value"
      />
    </div>
  );
}
