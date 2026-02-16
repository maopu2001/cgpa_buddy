import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ClearAllDataProps {
  className?: string;
}

export function ClearAllData({ className }: ClearAllDataProps) {
  const handleClearAll = () => {
    try {
      localStorage.clear();
      toast.success("All data cleared successfully");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Error clearing data:", error);
      toast.error("Failed to clear data");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={cn("h-9", className)}>
          <Trash2 className="size-4" />
          <span className="text-xs">Clear All Data</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-9/10 rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
          <div className="text-sm">
            This will permanently delete ALL data from the local storage of your
            browser, including:
            <ul className="list-[square] list-inside mt-2 space-y-1 ml-3">
              <li>All RMSTU department grades</li>
              <li>Custom calculator structures and grades</li>
              <li>Simple calculator data</li>
            </ul>
            <strong className="block mt-2 text-destructive">
              This action cannot be undone. Make sure to export your data first!
            </strong>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="ml-auto sm:w-1/2 w-full grid grid-cols-2 gap-2 h-10">
          <AlertDialogCancel className="h-full m-0">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="h-full m-0 bg-destructive hover:bg-destructive/90"
            onClick={handleClearAll}
          >
            Clear All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ResetDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ResetDialog({
  children,
  onConfirm,
  title = "Are you sure?",
  description = "This action will reset all data. This cannot be undone.",
}: ResetDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-9/10 rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="ml-auto sm:w-1/2 w-full grid grid-cols-2 gap-2 h-10">
          <AlertDialogCancel className="h-full m-0">Cancel</AlertDialogCancel>
          <AlertDialogAction className="h-full m-0" onClick={onConfirm}>
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
