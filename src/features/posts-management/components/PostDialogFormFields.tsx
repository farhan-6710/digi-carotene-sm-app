import { ProjectSelect } from "@/features/posts-management/components/ProjectSelect";
import { PostDateTimePicker } from "@/features/posts-management/components/PostDateTimePicker";
import { PostDialogLinkFields } from "@/features/posts-management/components/PostDialogLinkFields";
import { SocialsSelect } from "@/features/posts-management/components/SocialsSelect";
import { StatusSelect } from "@/features/posts-management/components/StatusSelect";
import type { SocialPlatform } from "@/features/posts-management/constants/postsManagement";
import { formFieldClassName } from "@/features/posts-management/constants/formStyles";
import type { StatusKey } from "@/features/posts-management/types/types";
import type { PostFormValues } from "@/features/posts-management/utils/postFormUtils";

type PostDialogFormFieldsProps = {
  values: PostFormValues;
  statusOptions: StatusKey[];
  disabled?: boolean;
  patchValues: (patch: Partial<PostFormValues>) => void;
};

export function PostDialogFormFields({
  values,
  statusOptions,
  disabled = false,
  patchValues,
}: PostDialogFormFieldsProps) {
  const showPostedOn =
    values.clientStatus === "Scheduled" || values.clientStatus === "Posted";

  return (
    <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-muted-foreground">
          Post title
          <input
            value={values.postTitle}
            onChange={(event) => patchValues({ postTitle: event.target.value })}
            placeholder="e.g. Summer Skincare Routine"
            className={formFieldClassName}
            disabled={disabled}
          />
        </label>
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-muted-foreground">
            Project
          </span>
          <ProjectSelect
            value={values.projectId}
            onChange={(projectId) => patchValues({ projectId })}
            disabled={disabled}
          />
        </div>
      </div>

      <SocialsSelect
        value={values.socials as SocialPlatform[]}
        onChange={(socials) => patchValues({ socials })}
        disabled={disabled}
      />

      <PostDateTimePicker
        label="To be posted on"
        value={values.toBePostedOn}
        onChange={(toBePostedOn) => patchValues({ toBePostedOn })}
        required
        disabled={disabled}
      />

      <StatusSelect
        value={values.clientStatus}
        onChange={(clientStatus) => patchValues({ clientStatus })}
        options={statusOptions}
        disabled={disabled}
      />

      {showPostedOn ? (
        <div className="animate-in duration-200 fade-in slide-in-from-top-2">
          <PostDateTimePicker
            label="Posted on"
            value={values.postedOn}
            onChange={(postedOn) => patchValues({ postedOn })}
            disabled={disabled}
          />
        </div>
      ) : null}

      <PostDialogLinkFields
        socials={values.socials}
        postLinks={values.postLinks}
        onPostLinksChange={(postLinks) => patchValues({ postLinks })}
        disabled={disabled}
      />
    </div>
  );
}
