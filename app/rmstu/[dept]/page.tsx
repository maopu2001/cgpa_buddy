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

interface Props {
  params: Promise<{ dept: string }>;
}

export default function CalculatorPage({ params }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("results");
  const { grades, electives, setGrade, setElective, resetAll } = useGrades();

  // Unwrap params Promise for Next.js 16
  const { dept } = use(params);
  const department = dept ? rmstu[dept] : null;

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

  const getOnlySemester = (code: string) => {
    const y = code[0],
      s = code[1];
    const semNum = 2 * (parseInt(y) - 1) + parseInt(s);
    switch (semNum) {
      case 1:
        return `${semNum}st`;
      case 2:
        return `${semNum}nd`;
      case 3:
        return `${semNum}rd`;
      default:
        return `${semNum}th`;
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
            <div className="flex items-center gap-2">
              {/* Printer Button need to be fix */}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="hidden sm:flex"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                <span>Print</span>
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:block">Reset</span>
              </Button>
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
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="results" className="text-sm grow">
                Results
              </TabsTrigger>
              {department.semesters.map((sem) => (
                <TabsTrigger
                  key={sem.code}
                  value={sem.code}
                  className="text-sm whitespace-nowrap grow gap-1"
                >
                  <span>{getOnlySemester(sem.code)}</span>
                  <span className="hidden md:block"> Semester</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-5xl px-4 py-6 mb-24">
          <TabsContent value="results">
            <ResultsDashboard
              semesters={department.semesters}
              grades={grades}
            />
          </TabsContent>

          {department.semesters.map((sem) => {
            const { gpa } = calcSemesterGPA(sem.subjects, grades);
            return (
              <TabsContent key={sem.code} value={sem.code}>
                <SemesterCard
                  semester={sem}
                  grades={grades}
                  electives={department.electives}
                  electiveSelections={electives}
                  onGradeChange={setGrade}
                  onElectiveChange={setElective}
                  gpa={gpa}
                />
              </TabsContent>
            );
          })}
        </main>
      </Tabs>
    </div>
  );
}
