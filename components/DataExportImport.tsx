"use client";
import { useRef } from "react";
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
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DataExportImportProps {
  action: "export" | "import";
  storageKey: string;
  label?: string;
  className?: string;
  output?: string;
}

export function DataExportImport({
  action,
  storageKey,
  label = "Data",
  className = "",
  output,
}: DataExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = localStorage.getItem(storageKey);
      if (!data) {
        toast.error("No data found to export");
        return;
      }

      // Create a blob with the data
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${output || `export-${storageKey}-${Date.now()}.json`}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        //should add more parsing and validation. later fix
        JSON.parse(content);

        localStorage.setItem(storageKey, content);

        toast.success("Data imported successfully.");

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import data. Invalid file format.");
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
    };

    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  if (action === "export") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className={cn("size-9 sm:w-fit gap-2", className)}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export {label}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-9/10 rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Export {label}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will download your {label.toLowerCase()} as a JSON file. You
              can use this file to backup or transfer your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="ml-auto sm:w-3/5 w-full grid grid-cols-2 gap-2 h-10">
            <AlertDialogCancel className="h-full m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-full m-0 bg-green-600"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className={cn("size-9 sm:w-fit gap-2", className)}
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import {label}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-9/10 rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Import {label}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current {label.toLowerCase()} with the data
              from the file. The page will reload automatically. Make sure to
              export your current data first if you want to keep it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="ml-auto sm:w-3/5 w-full grid grid-cols-2 gap-2 h-10">
            <AlertDialogCancel className="h-full m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleImportClick}
              className="h-full m-0 bg-cyan-600"
            >
              Choose File
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          aria-label="Import data file"
        />
      </AlertDialog>
    );
  }
}
