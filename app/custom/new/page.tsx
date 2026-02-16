"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCustomCGPA,
  type Semester,
  type Course,
} from "@/hooks/use-custom-cgpa";
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Trash2, ArrowLeft, Calculator, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ResetDialog } from "@/components/ResetDialog";
import { RemoveDialog } from "@/components/RemoveDialog";
import { DataExportImport } from "@/components/DataExportImport";

export default function CustomSetupPage() {
  const router = useRouter();
  const { structure, setStructure, resetAll } = useCustomCGPA();
  const [currentSemester, setCurrentSemester] = useState<string>("");

  const semesters = structure?.semesters || [];

  // New course form
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseCredit, setNewCourseCredit] = useState("");
  const [newCourseType, setNewCourseType] = useState<
    "theory" | "lab" | "special"
  >("theory");

  const addSemester = (year: string, sem: string) => {
    const yearNum = year.split(" ")[0]; // e.g., "1st" -> "1"
    const semNum = sem.split(" ")[0]; // e.g., "1st" -> "1"
    const code = `${yearNum}${semNum}`;

    // Check if semester already exists
    if (semesters.find((s) => s.code === code)) {
      toast.error("This semester already exists");
      return;
    }

    const newSemester: Semester = {
      year,
      semester: sem,
      code,
      courses: [],
    };

    const updatedSemesters = [...semesters, newSemester].sort((a, b) =>
      a.code.localeCompare(b.code),
    );
    setStructure({ semesters: updatedSemesters });
    setCurrentSemester(code);
    toast.success("Semester added successfully");
  };

  const removeSemester = (semesterCode: string) => {
    const updatedSemesters = semesters.filter((s) => s.code !== semesterCode);
    setStructure({ semesters: updatedSemesters });
    toast.success("Semester removed");
  };

  const addCourse = (semesterCode: string) => {
    const credit = parseFloat(newCourseCredit);
    if (!newCourseCode.trim()) {
      toast.error("Please enter a course code");
      return;
    }
    if (isNaN(credit) || credit <= 0 || credit > 10) {
      toast.error("Please enter a valid credit (0.5 - 10)");
      return;
    }

    const courseCode = newCourseCode.trim().toUpperCase();
    const courseName = newCourseName.trim() || courseCode;

    // Check if course code already exists across all semesters
    const isDuplicate = semesters.some((sem) =>
      sem.courses.some((course) => course.code === courseCode),
    );

    if (isDuplicate) {
      toast.error(`Course code "${courseCode}" already exists`);
      return;
    }

    const newCourse: Course = {
      name: courseName,
      code: courseCode,
      credit: credit,
      type: newCourseType,
    };

    const updatedSemesters = semesters.map((sem) =>
      sem.code === semesterCode
        ? { ...sem, courses: [...sem.courses, newCourse] }
        : sem,
    );
    setStructure({ semesters: updatedSemesters });

    setNewCourseName("");
    setNewCourseCode("");
    setNewCourseCredit("");
    setNewCourseType("theory");
    toast.success("Course added successfully");
  };

  const removeCourse = (semesterCode: string, courseCode: string) => {
    const updatedSemesters = semesters.map((sem) =>
      sem.code === semesterCode
        ? {
            ...sem,
            courses: sem.courses.filter((c) => c.code !== courseCode),
          }
        : sem,
    );
    setStructure({ semesters: updatedSemesters });
    toast.success("Course removed");
  };

  const proceedToCalculator = () => {
    if (semesters.length === 0) {
      toast.error("Please add at least one semester");
      return;
    }

    const hasCoursesInAllSemesters = semesters.every(
      (sem) => sem.courses.length > 0,
    );
    if (!hasCoursesInAllSemesters) {
      toast.error("All semesters must have at least one course");
      return;
    }

    router.push("/custom");
  };

  const getTotalCredits = () => {
    return semesters.reduce(
      (sum, sem) => sum + sem.courses.reduce((s, c) => s + c.credit, 0),
      0,
    );
  };

  const getTotalCourses = () => {
    return semesters.reduce((sum, sem) => sum + sem.courses.length, 0);
  };

  const handleReset = () => {
    resetAll();
    setCurrentSemester("");
    setNewCourseName("");
    setNewCourseCode("");
    setNewCourseCredit("");
    setNewCourseType("theory");
    toast.success("All data cleared");
  };

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
                Custom CGPA Calculator Setup
              </h1>
              <p className="text-xs text-muted-foreground">
                Add your semesters and courses
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <ResetDialog
              onConfirm={handleReset}
              title="Reset All Data?"
              description="This will remove all semesters and courses. This action cannot be undone."
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
              storageKey="custom-cgpa-data"
              label="Data"
            />

            <DataExportImport
              className="order-4 md:order-2"
              action="import"
              storageKey="custom-cgpa-data"
              label="Data"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Summary Card */}
            {semesters.length > 0 && (
              <Card>
                <CardContent className="order-1 md:order-2 flex flex-col items-start justify-between gap-4 p-6">
                  <div className="space-y-2 w-full">
                    <p className="text-sm text-muted-foreground">
                      Your Custom Structure
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <Badge
                        variant="secondary"
                        className="text-sm sm:text-base"
                      >
                        {semesters.length} Semester
                        {semesters.length > 1 ? "s" : ""}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-sm sm:text-base"
                      >
                        {getTotalCourses()} Course
                        {getTotalCourses() > 1 ? "s" : ""}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-sm sm:text-base"
                      >
                        {getTotalCredits().toFixed(1)} Credits
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={proceedToCalculator}
                    className="gap-2 w-full"
                  >
                    <Calculator className="size-4" />
                    <span>Go to Calculator</span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Add Semester */}
            <Card className="order-2 md:order-1">
              <CardHeader>
                <CardTitle className="text-xl">Add Semester</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  onValueChange={(value) => {
                    const sem = value.split("-")[1];
                    addSemester(value.split("-")[0], sem);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year & Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((year) =>
                      [1, 2].map((sem) => (
                        <SelectItem
                          key={`${year}-${sem}`}
                          value={`${year}${getOrdinal(year)} Year-${sem}${getOrdinal(sem)} Semester`}
                        >
                          {year}
                          {getOrdinal(year)} Year - {sem}
                          {getOrdinal(sem)} Semester
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Semesters List */}
          {semesters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Semesters</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  value={currentSemester}
                  onValueChange={setCurrentSemester}
                >
                  {semesters.map((semester) => (
                    <AccordionItem key={semester.code} value={semester.code}>
                      <div className="flex items-center gap-2 justify-between">
                        <AccordionTrigger className="hover:no-underline flex-1 gap-4 cursor-pointer">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="text-left min-w-0">
                              <p className="font-semibold text-sm sm:text-base truncate">
                                {semester.year} - {semester.semester}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                {semester.courses.length} course
                                {semester.courses.length !== 1
                                  ? "s"
                                  : ""} •{" "}
                                {semester.courses
                                  .reduce((sum, c) => sum + c.credit, 0)
                                  .toFixed(1)}{" "}
                                credits
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <RemoveDialog
                          onConfirm={() => removeSemester(semester.code)}
                          title={`Remove "${semester.year} ${semester.semester}"?`}
                          description="This will remove this semester and all its courses."
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </RemoveDialog>
                      </div>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          {/* Add Course Form */}
                          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                            <p className="text-sm font-medium">Add Course</p>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  placeholder="Course Code*"
                                  className="placeholder:text-sm"
                                  value={newCourseCode}
                                  onChange={(e) =>
                                    setNewCourseCode(e.target.value)
                                  }
                                />
                                <Input
                                  type="number"
                                  placeholder="Credit*"
                                  className="placeholder:text-sm"
                                  value={newCourseCredit}
                                  onChange={(e) =>
                                    setNewCourseCredit(e.target.value)
                                  }
                                  step="0.5"
                                  min="0.5"
                                  max="10"
                                />
                              </div>
                              <Input
                                placeholder="Course Name (Optional)"
                                className="placeholder:text-sm"
                                value={newCourseName}
                                onChange={(e) =>
                                  setNewCourseName(e.target.value)
                                }
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant={
                                      newCourseType === "theory"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    onClick={() => setNewCourseType("theory")}
                                    className="flex-1 max-w-50"
                                  >
                                    Theory
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={
                                      newCourseType === "lab"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    onClick={() => setNewCourseType("lab")}
                                    className="flex-1 max-w-50"
                                  >
                                    Lab
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={
                                      newCourseType === "special"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    onClick={() => setNewCourseType("special")}
                                    className="flex-1 max-w-50"
                                  >
                                    Special
                                  </Button>
                                </div>
                                <Button
                                  onClick={() => addCourse(semester.code)}
                                  className="gap-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Add Course</span>
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Courses List */}
                          {semester.courses.length > 0 && (
                            <div className="space-y-2">
                              {semester.courses.map((course) => (
                                <div
                                  key={course.code}
                                  className="flex items-center justify-between rounded-lg border bg-card p-3 sm:p-4 gap-2"
                                >
                                  <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="font-medium truncate">
                                        {course.name}
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {course.type.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {course.code} • {course.credit} Credit
                                      {course.credit > 1 ? "s" : ""}
                                    </p>
                                  </div>
                                  <RemoveDialog
                                    onConfirm={() =>
                                      removeCourse(semester.code, course.code)
                                    }
                                    title={`Remove (${course.code}) Course?`}
                                    description="This will remove this course from the semester."
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive hover:bg-destructive/10 shrink-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </RemoveDialog>
                                </div>
                              ))}
                            </div>
                          )}
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
                    Add your first semester above to begin. You can add multiple
                    years and semesters, then add courses to each semester.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function getOrdinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}
