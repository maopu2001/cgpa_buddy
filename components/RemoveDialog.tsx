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

interface RemoveDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function RemoveDialog({
  children,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}: RemoveDialogProps) {
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
          <AlertDialogAction
            onClick={onConfirm}
            className="h-full m-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
