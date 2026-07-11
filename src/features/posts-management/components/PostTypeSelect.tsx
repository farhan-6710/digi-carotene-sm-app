import { useMemo } from "react";

import {
  POST_TYPES,
  postTypeLabels,
} from "@/features/posts-management/constants/postsManagement";
import type { PostTypeSelectProps } from "@/features/posts-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function PostTypeSelect({
  id,
  value,
  onChange,
  disabled = false,
}: PostTypeSelectProps) {
  const options = useMemo(
    () => POST_TYPES.map((type) => ({ value: type, label: postTypeLabels[type] })),
    [],
  );

  return (
    <ComboBox
      id={id}
      value={value}
      onChange={(next) => onChange(next as PostTypeSelectProps["value"])}
      options={options}
      disabled={disabled}
      placeholder="Select a post type"
      listTitle="Select post type"
      mode="value"
    />
  );
}
