import {
  statusColors,
  statusLabels,
  statusOptions,
  statusText,
} from "@/features/posts-management/constants/postsManagement";

export function PostsManagementStatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {statusOptions.map((status) => (
        <div
          key={status}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1"
        >
          <span
            className={`size-2 shrink-0 rounded-full ${statusColors[status]}`}
            aria-hidden
          />
          <span className={`text-xs font-semibold ${statusText[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
      ))}
    </div>
  );
}
