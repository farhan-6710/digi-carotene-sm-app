import { useState, type ComponentProps, type MouseEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

type PasswordInputProps = Omit<ComponentProps<"input">, "type"> & {
  containerClassName?: string;
};

export function PasswordInput({
  className,
  containerClassName,
  disabled,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  function handleToggleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    // Keep focus on the input and avoid label/parent stealing the click.
    event.preventDefault();
  }

  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onMouseDown={handleToggleMouseDown}
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className={cn(
          "absolute top-1/2 right-1 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground",
          "hover:bg-muted hover:text-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        )}
      >
        {showPassword ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
