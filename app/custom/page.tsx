"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCustomCGPA } from "@/hooks/use-custom-cgpa";
import { calcSemesterGPA } from "@/lib/cgpa";
import SemesterCard from "@/components/SemesterCard";
import ResultsDashboard from "@/components/ResultsDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, Settings } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResetDialog } from "@/components/ResetDialog";
import { DataExportImport } from "@/components/DataExportImport";

export default function CustomCalculatorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("results");
  const {
    structure,
    grades,
    manualGPAs,
    fixGPAMap,
    mounted,
    dataLoaded,
    setGrade,
    setManualGPA,
    setFixGPA,
    resetGrades,
  } = useCustomCGPA();

  // Redirect to setup if no structure
  useEffect(() => {
    if (dataLoaded && !structure) {
      router.push("/custom/new");
    }
  }, [dataLoaded, structure, router]);

  const handleReset = () => {
    resetGrades();
    toast.success("All grades have been reset");
  };

  if (
    !dataLoaded ||
    !structure ||
    !structure.semesters ||
    structure.semesters.length === 0
  ) {
    return null;
  }

  // Convert custom structure to match the expected format
  const semesters = structure.semesters.map((sem) => ({
    year: sem.year,
    semester: sem.semester,
    code: sem.code,
    subjects: sem.courses.map((course) => ({
      name: course.name,
      code: course.code,
      credit: course.credit,
      type: course.type,
    })),
  }));

  const totalSubjects = semesters.reduce((a, s) => a + s.subjects.length, 0);
  const gradedSubjects = semesters.reduce(
    (a, s) =>
      a +
      s.subjects.filter(
        (sub) => grades[sub.code] !== undefined && grades[sub.code] !== null,
      ).length,
    0,
  );
  const progressPercent =
    totalSubjects > 0 ? (gradedSubjects / totalSubjects) * 100 : 0;

  const handleGoToSetup = () => {
    router.push("/custom/new");
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
                  Custom CGPA Calculator
                </h1>
                <p className="text-xs text-muted-foreground">
                  Your personalized calculator
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 ">
              <div className="md:hidden"></div>
              <ResetDialog
                onConfirm={handleReset}
                title="Reset All Grades?"
                description="This will clear all grades and manual GPAs for your custom structure. This action cannot be undone."
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-2 order-2 md:order-4"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:block">Reset Grades</span>
                </Button>
              </ResetDialog>

              <ThemeToggle className="order-3 md:order-5" />

              <DataExportImport
                className="order-4 md:order-1"
                action="export"
                storageKey="custom-cgpa-data"
                label="Data"
              />

              <DataExportImport
                className="order-5 md:order-2"
                action="import"
                storageKey="custom-cgpa-data"
                label="Data"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToSetup}
                className="flex gap-2 order-6 md:order-3"
              >
                <Settings className="h-3.5 w-3.5" />
                <span className="hidden sm:block">Edit Structure</span>
              </Button>
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

              {(() => {
                // Group semesters by year
                const yearGroups: Record<string, typeof semesters> = {};
                semesters.forEach((sem) => {
                  if (!yearGroups[sem.year]) {
                    yearGroups[sem.year] = [];
                  }
                  yearGroups[sem.year].push(sem);
                });

                return Object.entries(yearGroups).map(
                  ([year, semestersInYear]) => (
                    <div key={year} className="flex flex-col gap-2 min-w-fit">
                      <div className="font-semibold text-xs text-center -mb-1">
                        {year}
                      </div>
                      {semestersInYear.map((sem) => (
                        <TabsTrigger
                          key={sem.code}
                          value={sem.code}
                          className="text-sm whitespace-nowrap grow gap-1 border bg-accent/50"
                        >
                          <span>{sem.semester.split(" ")[0]}</span>
                          <span className="hidden md:inline">
                            {" "}
                            {sem.semester.split(" ")[1]}
                          </span>
                        </TabsTrigger>
                      ))}
                    </div>
                  ),
                );
              })()}
            </TabsList>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-5xl px-4 py-6 mb-24">
          <TabsContent value="results">
            <ResultsDashboard
              semesters={semesters}
              grades={grades}
              manualGPAs={manualGPAs}
              fixGPAMap={fixGPAMap}
            />
          </TabsContent>

          {semesters.map((sem) => {
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
                  deptCode="CUSTOM"
                  electiveSelections={{}}
                  onGradeChange={setGrade}
                  onElectiveChange={() => {}}
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
