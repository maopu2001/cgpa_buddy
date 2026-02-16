"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" className={cn(className, "h-9 w-9 md:w-fit")}>
        <span className="scale-100 dark:scale-0 flex items-center justify-between gap-2">
          <Sun className="h-4 w-4 rotate-0 transition-all dark:-rotate-90" />
          <span className="hidden md:block">Light Mode</span>
        </span>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(className, "h-9 w-9 sm:w-fit")}
    >
      <span className="scale-100 dark:scale-0 flex items-center justify-between gap-2">
        <Sun className="h-4 w-4 rotate-0 transition-all dark:-rotate-90" />
        <span className="hidden sm:block">Light Mode</span>
      </span>
      <span className="absolute scale-0 dark:scale-100 flex items-center justify-between gap-2">
        <Moon className="h-4 w-4 rotate-90 transition-all dark:rotate-0" />
        <span className="hidden sm:block">Dark Mode</span>
      </span>

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
