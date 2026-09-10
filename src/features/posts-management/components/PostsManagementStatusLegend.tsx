import {
  statusColors,
  statusOptions,
  statusText,
} from "@/features/posts-management/constants/postsManagement";

export function PostsManagementStatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {statusOptions.map((label) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1"
        >
          <span
            className={`size-2 shrink-0 rounded-full ${statusColors[label]}`}
            aria-hidden
          />
          <span className={`text-xs font-semibold ${statusText[label]}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
