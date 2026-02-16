"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSimpleCGPA, type SemesterData } from "@/hooks/use-simple-cgpa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/ThemeToggle";
import CGPAGauge from "@/components/CGPAGauge";
import { Plus, Trash2, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ResetDialog } from "@/components/ResetDialog";
import { RemoveDialog } from "@/components/RemoveDialog";
import { DataExportImport } from "@/components/DataExportImport";
import { Label } from "@/components/ui/label";

export default function SimpleCalculatorPage() {
  const router = useRouter();
  const {
    semesters,
    addSemester: addSemesterToHook,
    removeSemester: removeSemesterFromHook,
    updateSemester: updateSemesterInHook,
    resetAll,
  } = useSimpleCGPA();
  const [newSemesterName, setNewSemesterName] = useState("");
  const [newSemesterGPA, setNewSemesterGPA] = useState("");
  const [newSemesterCredits, setNewSemesterCredits] = useState("");

  const addSemester = () => {
    const gpa = newSemesterGPA === "" ? 0 : parseFloat(newSemesterGPA);
    const credits =
      newSemesterCredits === "" ? 0 : parseFloat(newSemesterCredits);

    if (!newSemesterName) {
      toast.error("Please select a semester");
      return;
    }
    if (semesters.some((s) => s.name === newSemesterName)) {
      toast.error("This semester has already been added");
      return;
    }
    if (isNaN(gpa) || gpa < 0 || gpa > 4) {
      toast.error("Please enter a valid GPA (0.00 - 4.00)");
      return;
    }
    if (isNaN(credits) || credits < 0 || credits > 50) {
      toast.error("Please enter valid credits (0 - 50)");
      return;
    }

    addSemesterToHook({
      name: newSemesterName,
      gpa: gpa,
      credits: credits,
    });
    setNewSemesterName("");
    setNewSemesterGPA("");
    setNewSemesterCredits("");
    toast.success("Semester added successfully");
  };

  const removeSemester = (name: string) => {
    removeSemesterFromHook(name);
    toast.success("Semester removed");
  };

  const updateSemester = (
    name: string,
    field: "gpa" | "credits",
    value: string,
  ) => {
    // Allow empty values
    if (value === "") {
      updateSemesterInHook(name, field, "");
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Validate GPA range - prevent invalid input
      if (field === "gpa") {
        if (numValue < 0) {
          toast.error("GPA cannot be less than 0");
          return;
        } else if (numValue > 4) {
          toast.error("GPA cannot be greater than 4.00");
          return;
        }
      }

      updateSemesterInHook(name, field, numValue);
    }
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach((sem) => {
      const gpa =
        typeof sem.gpa === "string" ? parseFloat(sem.gpa) || 0 : sem.gpa;
      const credits =
        typeof sem.credits === "string"
          ? parseFloat(sem.credits) || 0
          : sem.credits;

      if (gpa > 0 && credits > 0) {
        totalCredits += credits;
        totalPoints += gpa * credits;
      }
    });

    return {
      cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
      totalCredits,
      totalSemesters: semesters.length,
    };
  };

  const getYearlyBreakdown = () => {
    const yearMap = new Map<string, SemesterData[]>();

    semesters.forEach((sem) => {
      const yearMatch = sem.name.match(/^(\d+(?:st|nd|rd|th) Year)/);
      if (yearMatch) {
        const year = yearMatch[1];
        if (!yearMap.has(year)) {
          yearMap.set(year, []);
        }
        yearMap.get(year)!.push(sem);
      }
    });

    // Sort years naturally
    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return aNum - bNum;
    });

    return sortedYears.map((year) => {
      const yearSemesters = yearMap.get(year)!;
      let totalPoints = 0;
      let totalCredits = 0;

      yearSemesters.forEach((sem) => {
        const gpa =
          typeof sem.gpa === "string" ? parseFloat(sem.gpa) || 0 : sem.gpa;
        const credits =
          typeof sem.credits === "string"
            ? parseFloat(sem.credits) || 0
            : sem.credits;

        if (gpa > 0 && credits > 0) {
          totalCredits += credits;
          totalPoints += gpa * credits;
        }
      });

      const yearGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

      return {
        year,
        yearGPA,
        totalCredits,
        semesters: yearSemesters.sort((a, b) => a.name.localeCompare(b.name)),
      };
    });
  };

  const handleReset = () => {
    resetAll();
    setNewSemesterName("");
    setNewSemesterGPA("");
    setNewSemesterCredits("");
    toast.success("All data cleared");
  };

  const results = calculateCGPA();
  const yearlyBreakdown = getYearlyBreakdown();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-sm font-bold text-foreground sm:text-base">
                Simple CGPA Calculator
              </h1>
              <p className="text-xs text-muted-foreground">
                Calculate CGPA from semester results
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <ResetDialog
              onConfirm={handleReset}
              title="Reset All Data?"
              description="This will remove all semesters and their data. This action cannot be undone."
            >
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 order-1 md:order-3"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:block">Reset</span>
              </Button>
            </ResetDialog>

            <ThemeToggle className="order-2 md:order-4" />

            <DataExportImport
              className="order-3 md:order-1"
              action="export"
              storageKey="simple-cgpa-data"
              label="Data"
            />
            <DataExportImport
              className="order-4 md:order-2"
              action="import"
              storageKey="simple-cgpa-data"
              label="Data"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Add Semester Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Add Semester</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={newSemesterName}
                  onValueChange={setNewSemesterName}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year & semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((year) =>
                      [1, 2].map((sem) => {
                        const getOrdinal = (n: number) =>
                          n === 1
                            ? "st"
                            : n === 2
                              ? "nd"
                              : n === 3
                                ? "rd"
                                : "th";
                        const label = `${year}${getOrdinal(year)} Year ${sem}${getOrdinal(sem)} Semester`;

                        // Don't show if already added
                        if (semesters.some((s) => s.name === label)) {
                          return null;
                        }

                        return (
                          <SelectItem key={`${year}-${sem}`} value={label}>
                            {label}
                          </SelectItem>
                        );
                      }),
                    )}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label
                      htmlFor="gpa-input"
                      className="text-xs text-muted-foreground ml-1"
                    >
                      GPA
                    </Label>
                    <Input
                      id="gpa-input"
                      type="number"
                      placeholder="0.00 - 4.00"
                      value={newSemesterGPA}
                      onChange={(e) => setNewSemesterGPA(e.target.value)}
                      step="0.01"
                      min="0"
                      max="4"
                      className="h-9 placeholder:text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const creditsInput = document.getElementById(
                            "credits-input",
                          ) as HTMLInputElement;
                          creditsInput?.focus();
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="credits-input"
                      className="text-xs text-muted-foreground ml-1"
                    >
                      Credits
                    </Label>
                    <Input
                      id="credits-input"
                      type="number"
                      value={newSemesterCredits}
                      onChange={(e) => setNewSemesterCredits(e.target.value)}
                      step="0.5"
                      min="0.5"
                      max="50"
                      className="h-9 placeholder:text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addSemester();
                        }
                      }}
                    />
                  </div>
                </div>
                <Button onClick={addSemester} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Semester
                </Button>
              </CardContent>
            </Card>

            {/* Semesters List */}
            {semesters.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Your Semesters ({semesters.length})
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {results.totalCredits.toFixed(1)} Credits
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {semesters
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((semester) => (
                        <div
                          key={semester.name}
                          className="flex flex-col gap-2 rounded-lg border bg-card p-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">
                              {semester.name}
                            </p>
                            <RemoveDialog
                              onConfirm={() => removeSemester(semester.name)}
                              title={`Remove "${semester.name}"?`}
                              description="This will remove this semester and its data."
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 shrink-0 h-7 w-7"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </RemoveDialog>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">
                                GPA
                              </label>
                              <Input
                                type="number"
                                value={semester.gpa}
                                onChange={(e) =>
                                  updateSemester(
                                    semester.name,
                                    "gpa",
                                    e.target.value,
                                  )
                                }
                                step="0.01"
                                min="0"
                                max="4"
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">
                                Credits
                              </label>
                              <Input
                                type="number"
                                value={semester.credits}
                                onChange={(e) =>
                                  updateSemester(
                                    semester.name,
                                    "credits",
                                    e.target.value,
                                  )
                                }
                                step="0.5"
                                min="0.5"
                                max="50"
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Your CGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6">
                  <CGPAGauge value={results.cgpa} max={4} size={220} />
                  <p className="-mt-2 font-semibold text-sm">Out of 4.00</p>
                  <div className="grid w-full grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-muted/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Total Semesters
                      </p>
                      <p className="text-2xl font-bold">
                        {results.totalSemesters}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Total Credits
                      </p>
                      <p className="text-2xl font-bold">
                        {results.totalCredits.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Semester Breakdown */}
            {semesters.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Semester Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="multiple"
                    defaultValue={yearlyBreakdown.map((y, i) => `year-${i}`)}
                    className="space-y-2"
                  >
                    {yearlyBreakdown.map((yearData, index) => (
                      <AccordionItem
                        key={yearData.year}
                        value={`year-${index}`}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-sm">
                                {yearData.year}
                              </span>
                              <span
                                className={`text-lg font-bold ${
                                  yearData.yearGPA >= 3.75
                                    ? "text-emerald-500"
                                    : yearData.yearGPA >= 3.25
                                      ? "text-blue-500"
                                      : yearData.yearGPA >= 2.75
                                        ? "text-amber-500"
                                        : yearData.yearGPA >= 2.0
                                          ? "text-orange-500"
                                          : "text-red-500"
                                }`}
                              >
                                {yearData.yearGPA.toFixed(2)}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {yearData.totalCredits.toFixed(1)} credits
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 pt-1">
                          <div className="grid grid-cols-2 gap-2">
                            {yearData.semesters.map((semester) => {
                              const semGPA =
                                typeof semester.gpa === "string"
                                  ? parseFloat(semester.gpa) || 0
                                  : semester.gpa;
                              const semCredits =
                                typeof semester.credits === "string"
                                  ? parseFloat(semester.credits) || 0
                                  : semester.credits;
                              const hasData = semGPA > 0 && semCredits > 0;

                              return (
                                <div
                                  key={semester.name}
                                  className={`rounded-lg border p-3 text-center transition-colors ${
                                    hasData
                                      ? semGPA >= 3.75
                                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900"
                                        : semGPA >= 3.25
                                          ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                                          : semGPA >= 2.75
                                            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900"
                                            : semGPA >= 2.0
                                              ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900"
                                              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                                      : "bg-muted/50"
                                  }`}
                                >
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {semester.name.replace(
                                      yearData.year + " ",
                                      "",
                                    )}
                                  </p>
                                  <p className="mt-1 text-xl font-bold text-foreground">
                                    {hasData ? semGPA.toFixed(2) : "—"}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {semCredits > 0
                                      ? `${semCredits.toFixed(1)} credits`
                                      : "—"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {semesters.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold">Get Started</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Add your semesters with their GPA and total credits to
                      calculate your overall CGPA instantly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
