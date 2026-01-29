import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-lg border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-base shadow-sm transition-all duration-200",
        "placeholder:text-muted-foreground/60",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-4 focus-visible:ring-blue-100",
        "hover:border-slate-300",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
        "dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100",
        "dark:placeholder:text-slate-400",
        "dark:hover:border-slate-600",
        "dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500/20",
        "aria-invalid:border-red-400 aria-invalid:ring-red-100 dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-500/20",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
