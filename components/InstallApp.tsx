"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Hint from "./svg/hint";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window === "undefined") {
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      const beforeInstallEvent = event as BeforeInstallPromptEvent;
      beforeInstallEvent.preventDefault();
      setDeferredPrompt(beforeInstallEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const addToHomeScreen = async () => {
    if (!deferredPrompt || isInstalling) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const isDisabled = isInstalling || !deferredPrompt;

  if (!isMounted) {
    return null;
  }

  return deferredPrompt ? (
    <Button
      className="h-9 w-fit"
      onClick={addToHomeScreen}
      disabled={isDisabled}
      size="sm"
      variant="outline"
    >
      <Download className="size-4" />
      {isInstalling ? "Opening..." : "Install App"}
    </Button>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 w-fit" size="sm" variant="outline">
          <Hint className="size-4" />
          Install Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="w-9/10 rounded-sm">
        <DialogHeader>
          <DialogTitle>Installation Guide</DialogTitle>
          <DialogDescription className="mt-2">
            Use your browser menu to add this web app to your Android home
            screen.
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
          <li>Open this site in an android browser.</li>
          <li>Tap the 3-dot menu in the top-right corner.</li>
          <li>Tap "Install App" or "Add to Home screen".</li>
          <li>Tap "Install" or "Add" to confirm.</li>
        </ol>
        <p className="text-sm text-destructive font-semibold">
          Note: Some pc or mac browser also support this feature, but the
          installation process may be different.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default InstallApp;
