import { formFieldClassName } from "@/features/posts-management/constants/formStyles";

type PostDialogLinkFieldsProps = {
  socials: string[];
  postLinks: Record<string, string>;
  onPostLinksChange: (links: Record<string, string>) => void;
  disabled?: boolean;
};

export function PostDialogLinkFields({
  socials,
  postLinks,
  onPostLinksChange,
  disabled = false,
}: PostDialogLinkFieldsProps) {
  if (socials.length === 0) {
    return null;
  }

  return (
    <div className="animate-in space-y-3 border-t border-border/60 pt-4 duration-200 fade-in">
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Post Links
      </span>
      <div className="grid gap-4 sm:grid-cols-2">
        {socials.map((platform) => {
          const key = platform.toLowerCase();

          return (
            <label
              key={platform}
              className="block text-xs font-semibold text-muted-foreground"
            >
              {platform} Post Link
              <input
                type="url"
                value={postLinks[key] ?? ""}
                onChange={(event) => {
                  onPostLinksChange({
                    ...postLinks,
                    [key]: event.target.value,
                  });
                }}
                placeholder={`e.g. ${key}.com/p/your-post`}
                className={formFieldClassName}
                disabled={disabled}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
