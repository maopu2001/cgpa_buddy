"use client";

import { cn } from "@/lib/utils";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { CircleArrowDown, Download } from "lucide-react";
import { toast } from "sonner";

interface DataExportImportProps {
  storageKey: string;
  fileName: string;
  label: string;
  inputType?: "builtin" | "custom" | "simple";
  className?: string;
}

export default function DownloadSummary({
  storageKey,
  fileName,
  label,
  inputType = "builtin",
  className = "",
}: DataExportImportProps) {
  const handleDownload = async () => {
    if (inputType === "simple") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) {
          toast.error("No saved data found to generate PDF.");
          return;
        }

        const parsed = JSON.parse(saved) as {
          semesters?: Array<{
            name: string;
            gpa: number;
            credits: number;
          }>;
        };

        const semesters = parsed.semesters ?? [];
        if (!Array.isArray(semesters) || semesters.length === 0) {
          toast.error("Simple data is invalid or empty.");
          return;
        }

        const response = await fetch("/api/pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ semesters }),
        });

        if (!response.ok) {
          let errorMessage = "Failed to generate PDF.";
          try {
            const body = (await response.json()) as { error?: string };
            if (body.error) {
              errorMessage = body.error;
            }
          } catch {
            // Ignore JSON parse failures from non-JSON error responses.
          }

          toast.error(errorMessage);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully.");
      } catch {
        toast.error("Failed to download PDF.");
      }
      return;
    }

    if (inputType === "builtin") {
      try {
        const saved = localStorage.getItem(storageKey);

        if (!saved) {
          toast.error("No saved data found to generate PDF.");
          return;
        }

        const parsed = JSON.parse(saved) as {
          grades?: Record<string, number | null>;
          electives?: Record<string, string>;
          manualGPAs?: Record<string, number>;
          fixGPAMap?: Record<string, boolean>;
        };

        const grades = parsed.grades ?? {};
        if (!grades || typeof grades !== "object") {
          toast.error(
            "Saved data is invalid. Please re-export/import your data.",
          );
          return;
        }

        const deptMatch = storageKey.match(/^rmstu-([a-z0-9]+)-cgpa-data$/i);
        const deptCode = deptMatch?.[1]?.toUpperCase();

        const payload = {
          grades,
          electives: parsed.electives ?? {},
          manualGPAs: parsed.manualGPAs ?? {},
          fixGPAMap: parsed.fixGPAMap ?? {},
          ...(deptCode ? { deptCode } : {}),
        };

        const response = await fetch("/api/pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let errorMessage = "Failed to generate PDF.";
          try {
            const body = (await response.json()) as { error?: string };
            if (body.error) {
              errorMessage = body.error;
            }
          } catch {
            // Ignore JSON parse failures from non-JSON error responses.
          }

          toast.error(errorMessage);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully.");
      } catch {
        toast.error("Failed to download PDF.");
      }
      return;
    }

    if (inputType === "custom") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) {
          toast.error("No saved data found to generate PDF.");
          return;
        }

        const parsed = JSON.parse(saved) as {
          structure?: {
            semesters?: Array<{
              year: string;
              semester: string;
              code: string;
              courses: Array<{
                name: string;
                code: string;
                credit: number;
                type: "theory" | "lab" | "special";
              }>;
            }>;
          };
          grades?: Record<string, number | null>;
          manualGPAs?: Record<string, number>;
          fixGPAMap?: Record<string, boolean>;
        };

        const structure = parsed.structure;
        const semesters = structure?.semesters ?? [];
        if (!structure || !Array.isArray(semesters) || semesters.length === 0) {
          toast.error("Custom structure is missing or empty.");
          return;
        }

        const grades = parsed.grades ?? {};
        const sanitizedGrades = Object.fromEntries(
          Object.entries(grades).filter(([, value]) => value !== null),
        ) as Record<string, number>;

        const response = await fetch("/api/pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            structure,
            grades: sanitizedGrades,
            manualGPAs: parsed.manualGPAs ?? {},
            fixGPAMap: parsed.fixGPAMap ?? {},
          }),
        });

        if (!response.ok) {
          let errorMessage = "Failed to generate PDF.";
          try {
            const body = (await response.json()) as { error?: string };
            if (body.error) {
              errorMessage = body.error;
            }
          } catch {
            // Ignore JSON parse failures from non-JSON error responses.
          }

          toast.error(errorMessage);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully.");
      } catch {
        toast.error("Failed to download PDF.");
      }
      return;
    }

    toast.error("Unknown download type.");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("size-9 sm:w-fit gap-2", className)}
        >
          <CircleArrowDown className="h-4 w-4" />
          <span className="flex gap-1">
            <span>Download</span>
            <span className="hidden sm:inline">PDF</span>
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-9/10 rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Download {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will download your Result Summary as a PDF file.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="ml-auto sm:w-3/5 w-full grid grid-cols-2 gap-2 h-10">
          <AlertDialogCancel className="h-full m-0">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="h-full m-0 bg-green-600"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
