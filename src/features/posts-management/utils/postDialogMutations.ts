import { fetchProjectsScoped } from "@/services/projectsService";
import { findRegisteredProject } from "@/features/posts-management/utils/projectValidationUtils";
import {
  postFormToPayload,
  validatePostForm,
  type PostFormValues,
} from "@/features/posts-management/utils/postFormUtils";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/services/postsService";
import { createPostApprovalRequest } from "@/services/postApprovalsService";
import { requiresBackdatedPostApproval } from "@/features/post-approvals/utils/postApprovalRules";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { showToast } from "@/shared/utils/showToast";

type SavePostOptions = {
  values: PostFormValues;
  editingPostId: string | null;
  teamRole: TeamMemberRole | null;
  teamMemberId: string | null;
  setError: (message: string | null) => void;
};

type DeletePostOptions = {
  editingPostId: string;
  setError: (message: string | null) => void;
};

export async function savePostMutation({
  values,
  editingPostId,
  teamRole,
  teamMemberId,
  setError,
}: SavePostOptions): Promise<boolean> {
  const validationError = validatePostForm(values);
  if (validationError) {
    setError(validationError);
    return false;
  }

  setError(null);

  const projects = await fetchProjectsScoped(teamRole, teamMemberId);

  if (projects.length === 0) {
    showToast("error", "Create a project before adding posts.");
    return false;
  }

  const registeredProject = findRegisteredProject(values.projectId, projects);

  if (!registeredProject) {
    showToast("error", "Please select a valid project or create one first.");
    return false;
  }

  const payload = {
    ...postFormToPayload(values),
    projectId: registeredProject.id,
  };

  const postLabel = values.postTitle.trim() || "Post";

  if (editingPostId) {
    await updatePost(editingPostId, payload);
    showToast("success", `"${postLabel}" updated successfully.`);
  } else if (
    requiresBackdatedPostApproval(teamRole, payload.toBePostedOn)
  ) {
    if (!teamMemberId) {
      showToast("error", "Your team member profile is required to request approval.");
      return false;
    }

    await createPostApprovalRequest(payload, teamMemberId);
    showToast(
      "info",
      "Approval request sent to the project manager and admins.",
    );
  } else {
    await createPost(payload);
    showToast("success", `"${postLabel}" added successfully.`);
  }

  return true;
}

export async function deletePostMutation({
  editingPostId,
  setError,
}: DeletePostOptions): Promise<boolean> {
  setError(null);

  try {
    await deletePost(editingPostId);
    showToast("success", "Post removed successfully.");
    return true;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete this post.";
    setError(message);
    showToast("error", message);
    return false;
  }
}
