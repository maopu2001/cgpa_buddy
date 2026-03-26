"use client";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { rmstu } from "@/data/rmstu";
import { useGrades } from "@/hooks/use-grades";
import { calcSemesterGPA } from "@/lib/cgpa";
import SemesterCard from "@/components/SemesterCard";
import ResultsDashboard from "@/components/ResultsDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, Printer } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResetDialog } from "@/components/ResetDialog";
import { DataExportImport } from "@/components/DataExportImport";
import { Card } from "@/components/ui/card";
import DownloadSummary from "@/components/DownloadSummary";

interface Props {
  params: Promise<{ dept: string }>;
}

export default function CalculatorPage({ params }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("results");

  // Unwrap params Promise for Next.js 16
  const { dept } = use(params);
  const department = dept ? rmstu[dept] : null;

  const {
    grades,
    electives,
    manualGPAs,
    fixGPAMap,
    setGrade,
    setElective,
    setManualGPA,
    setFixGPA,
    resetAll,
  } = useGrades(dept);

  if (!department || department.semesters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Department not found
          </h2>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const totalSubjects = department.semesters.reduce(
    (a, s) => a + s.subjects.length,
    0,
  );
  const gradedSubjects = department.semesters.reduce(
    (a, s) =>
      a +
      s.subjects.filter(
        (sub) => grades[sub.code] !== undefined && grades[sub.code] !== null,
      ).length,
    0,
  );
  const progressPercent =
    totalSubjects > 0 ? (gradedSubjects / totalSubjects) * 100 : 0;

  const handleReset = () => {
    resetAll();
    toast.success("All grades have been cleared.");
  };

  const handlePrint = () => {
    window.print();
  };

  const getOrdinals = (n: number) => {
    switch (n) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md py-2">
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
                  {department.dept}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {department.university}
                </p>
              </div>
            </div>
            <div className="grid gap-2 grid-cols-2">
              <ResetDialog
                onConfirm={handleReset}
                title="Reset All Grades?"
                description="This will clear all grades, electives, and manual GPAs. This action cannot be undone."
              >
                <Button variant="outline" size="sm" className="flex gap-2">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:block">Reset</span>
                </Button>
              </ResetDialog>

              <ThemeToggle />
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-4 pb-2">
            <div className="flex items-center gap-3">
              <Progress value={progressPercent} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                {gradedSubjects}/{totalSubjects}
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-4 pb-2">
            <TabsList className="w-full justify-start overflow-x-auto h-auto grid grid-cols-5 grow gap-2 p-2">
              <div className="flex flex-col gap-2 size-full">
                <div className="font-semibold text-xs text-center -mb-1">
                  Combined
                </div>
                <TabsTrigger
                  value="results"
                  className="size-full text-xs md:text-base bg-accent"
                >
                  <span className="flex flex-col bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    <span>Result</span>
                    <span>Summary</span>
                  </span>
                </TabsTrigger>
              </div>

              {Array.from({ length: department.semesters.length / 2 }).map(
                (_, yearIndex) => {
                  const firstSem = department.semesters[yearIndex * 2];
                  const secondSem = department.semesters[yearIndex * 2 + 1];

                  return (
                    <div key={yearIndex} className="flex flex-col gap-2">
                      <div className="font-semibold text-xs text-center -mb-1">
                        {getOrdinals(yearIndex + 1)} Year
                      </div>

                      <TabsTrigger
                        key={firstSem.code}
                        value={firstSem.code}
                        className="text-sm whitespace-nowrap grow gap-1 border bg-accent/50"
                      >
                        <span>1st</span>
                        <span className="hidden md:block"> Semester</span>
                      </TabsTrigger>

                      <TabsTrigger
                        key={secondSem.code}
                        value={secondSem.code}
                        className="text-sm whitespace-nowrap grow gap-1 border bg-accent/50"
                      >
                        <span>2nd</span>
                        <span className="hidden md:block"> Semester</span>
                      </TabsTrigger>
                    </div>
                  );
                },
              )}
            </TabsList>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-5xl px-4 py-6 mb-24">
          <TabsContent value="results">
            {/* This card contains the export/import buttons and the print summary button */}
            <Card className="mb-4 p-2 flex gap-2">
              <DataExportImport
                className="flex-1"
                action="export"
                storageKey={`rmstu-${dept.toLowerCase()}-cgpa-data`}
                label="Data"
              />

              <DataExportImport
                className="flex-1"
                action="import"
                storageKey={`rmstu-${dept.toLowerCase()}-cgpa-data`}
                label="Data"
              />

              <DownloadSummary
                className="flex-1"
                storageKey={`rmstu-${dept.toLowerCase()}-cgpa-data`}
                fileName={`ResultSummary-rmstu-${dept.toLowerCase()}`}
                label="Result Summary"
              />
            </Card>

            {/* This is the combined results dashboard that shows all semesters together */}
            <ResultsDashboard
              semesters={department.semesters}
              grades={grades}
              manualGPAs={manualGPAs}
              fixGPAMap={fixGPAMap}
            />
          </TabsContent>

          {department.semesters.map((sem) => {
            const { gpa } = calcSemesterGPA(
              sem.subjects,
              grades,
              sem.code,
              manualGPAs,
              fixGPAMap,
            );
            const isFixedGPA = fixGPAMap[sem.code] || false;
            const displayGPA = isFixedGPA ? manualGPAs[sem.code] || 0 : gpa;

            return (
              <TabsContent key={sem.code} value={sem.code}>
                <SemesterCard
                  semester={sem}
                  grades={grades}
                  deptCode={dept}
                  electiveSelections={electives}
                  onGradeChange={setGrade}
                  onElectiveChange={setElective}
                  gpa={displayGPA}
                  calculatedGPA={gpa}
                  fixGPA={isFixedGPA}
                  setFixGPA={(fix) => setFixGPA(sem.code, fix)}
                  setManualGPA={(gpa) => setManualGPA(sem.code, gpa)}
                />
              </TabsContent>
            );
          })}
        </main>
      </Tabs>
    </div>
  );
}
