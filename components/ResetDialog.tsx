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
