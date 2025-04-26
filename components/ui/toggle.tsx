"use client";

import { Switch } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const Toggle = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        {label && (
          <span className="text-sm font-medium text-gray-900">{label}</span>
        )}
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>

      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          enabled ? "bg-primary" : "bg-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1",
          )}
        />
      </Switch>
    </div>
  );
};

export default Toggle;
