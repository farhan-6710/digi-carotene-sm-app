import type { AccountCredentialsListProps } from "@/features/account/types/components";

export function AccountCredentialsList({
  credentials,
  specializations,
}: AccountCredentialsListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <div className="text-sm font-semibold">Credentials & focus areas</div>
      </div>

      <div className="space-y-6 px-6 py-5">
        <div>
          <div className="text-xs font-semibold tracking-wider text-muted-foreground">
            SPECIALIZATIONS
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {specializations.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border border-t border-border pt-5">
          {credentials.map((credential) => (
            <div key={credential.title} className="py-3 first:pt-0 last:pb-0">
              <div className="text-sm font-medium text-foreground">
                {credential.title}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {credential.issuer} · {credential.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
