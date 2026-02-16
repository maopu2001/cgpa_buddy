import {
  Subject,
  GRADE_SCALE,
  Semester,
  getCSEElectiveOptions,
} from "@/data/rmstu";
import { GradeMap } from "@/lib/cgpa";
import { ElectiveSelection } from "@/hooks/use-grades";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { PenOff, SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { ResetDialog } from "@/components/ResetDialog";

interface Props {
  semester: Semester;
  deptCode: string;
  grades: GradeMap;
  electiveSelections: ElectiveSelection;
  onGradeChange: (code: string, value: number | null) => void;
  onElectiveChange: (electiveCode: string, subjectCode: string) => void;
  gpa: number;
  calculatedGPA: number;
  fixGPA: boolean;
  setFixGPA: (fix: boolean) => void;
  setManualGPA: (gpa: number) => void;
}

const SemesterCard = ({
  semester,
  grades,
  deptCode,
  electiveSelections,
  onGradeChange,
  onElectiveChange,
  gpa,
  calculatedGPA,
  fixGPA,
  setFixGPA,
  setManualGPA: setManualGPACallback,
}: Props) => {
  const [manualGPAInput, setManualGPAInput] = useState<string>(gpa.toFixed(2));

  // Sync manualGPAInput with gpa prop when switching semesters or exiting manual mode
  useEffect(() => {
    if (!fixGPA) {
      setManualGPAInput(gpa.toFixed(2));
    }
  }, [gpa, fixGPA]);

  // Sync when semester changes (switching tabs)
  useEffect(() => {
    setManualGPAInput(gpa.toFixed(2));
  }, [semester.code]);

  const isElective = (code: string) => code.startsWith("ELECTIVE");
  const totalCredits = semester.subjects.reduce((a, s) => a + s.credit, 0);

  // Calculate earned credits - if manual mode with valid GPA, all credits are earned
  // F grade (0.0) should not count as earned credits
  const earnedCredits =
    fixGPA && parseFloat(manualGPAInput) > 0
      ? totalCredits
      : semester.subjects
          .filter(
            (s) =>
              grades[s.code] !== undefined &&
              grades[s.code] !== null &&
              grades[s.code]! > 0,
          )
          .reduce((a, s) => a + s.credit, 0);

  const displayGPA = fixGPA ? manualGPAInput : gpa.toFixed(2);

  const renderSubjectRow = (subject: Subject) => {
    const elective = isElective(subject.code);
    const selectedElective = electiveSelections[subject.code];

    return (
      <div
        key={subject.code}
        className="flex flex-col gap-3 rounded-lg border bg-card p-4"
      >
        <div className="flex-1 min-w-0">
          {elective ? (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-mono flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-xs border-secondary/40 text-secondary"
                >
                  {selectedElective || subject.code} |{" "}
                  {subject.type.toUpperCase()}
                </Badge>

                <span>{subject.credit} Credits</span>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedElective
                    ? getCSEElectiveOptions(subject.code, deptCode).find(
                        (e) => e.code === selectedElective,
                      )?.name
                    : "Choose Elective"}
                </p>
                <Badge
                  variant="outline"
                  className="text-xs border-secondary/40 text-secondary"
                >
                  Elective
                </Badge>
              </div>

              <Select
                value={selectedElective || ""}
                onValueChange={(val) => onElectiveChange(subject.code, val)}
                disabled={fixGPA}
              >
                <SelectTrigger className="h-8 text-xs mt-1.5">
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  {getCSEElectiveOptions(subject.code, deptCode).map((e) => (
                    <SelectItem key={e.code} value={e.code} className="text-xs">
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-mono flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-xs border-secondary/40 text-secondary"
                >
                  {subject.code} | {subject.type.toUpperCase()}
                </Badge>
                <span>{subject.credit} Credits</span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {subject.name}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {GRADE_SCALE.map((g) => {
            const isSelected = grades[subject.code] === g.value;
            const gradeLabel = g.label.split(" ")[0]; // Extract grade letter (e.g., "A+")
            return (
              <Button
                key={g.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onGradeChange(subject.code, g.value)}
                className="px-3 h-12 font-medium grow flex flex-col items-center justify-center gap-0"
                disabled={fixGPA}
              >
                <span>{gradeLabel}</span>
                <span className="text-[8px]">{g.value.toFixed(2)}</span>
              </Button>
            );
          })}

          <Button
            variant={grades[subject.code] === null ? "default" : "outline"}
            size="sm"
            onClick={() => onGradeChange(subject.code, null)}
            className="px-3 h-12 font-medium text-xs grow flex flex-col items-center justify-center gap-0"
            disabled={fixGPA}
          >
            <span>Skip</span>
            <span className="text-[8px]">Don't Count</span>
          </Button>
        </div>
      </div>
    );
  };

  const handleManualInput = () => {
    // Reset all grades for this semester
    semester.subjects.forEach((subject) => {
      onGradeChange(subject.code, undefined as any);
    });
    const initialGPA = calculatedGPA.toFixed(2);
    setManualGPAInput(initialGPA);
    setManualGPACallback(parseFloat(initialGPA));
    setFixGPA(true);
  };

  const handleCourseWiseInput = () => {
    setFixGPA(false);
  };

  const handleManualGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty, numbers, and decimal points (including trailing decimal)
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);

      // If it's a valid number, check it doesn't exceed 4.0
      // If it's empty or invalid (like "." or "3."), allow it as intermediate input
      if (value === "" || isNaN(numValue) || numValue <= 4.0) {
        setManualGPAInput(value);

        // Update parent state immediately when we have a valid complete number
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 4.0) {
          setManualGPACallback(numValue);
        }
      }
    }
  };

  const handleManualGPABlur = () => {
    const numValue = parseFloat(manualGPAInput);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 4.0) {
      setManualGPACallback(numValue);
    } else if (manualGPAInput === "" || isNaN(numValue)) {
      // If invalid, reset to 0
      setManualGPAInput("0.00");
      setManualGPACallback(0);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        {/* floating result */}
        <div className="flex items-center justify-between fixed bg-background/60 bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-[calc(100%-2em)] max-w-4xl py-4 px-6 border rounded-lg shadow-lg backdrop-blur-sm">
          <div>
            <CardTitle className="text-lg">
              {semester.year} {semester.semester}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {earnedCredits}/{totalCredits} credits earned
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {fixGPA ? manualGPAInput || "0.00" : gpa.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">GPA</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex rounded-lg border bg-card p-4">
          <div className="flex gap-2 md:gap-5 items-center w-full">
            <span className="text-center text-sm sm:text-base flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
              <span>Achieved</span>
              <span>GPA</span>
            </span>
            <Input
              value={displayGPA}
              disabled={!fixGPA}
              onChange={handleManualGPAChange}
              onBlur={handleManualGPABlur}
              type="text"
              className="min-w-20 text-center sm:text-left"
            />
            <div className="flex gap-2">
              <ResetDialog
                onConfirm={handleManualInput}
                title="Switch to Manual Input?"
                description="This will clear all course grades for this semester and allow you to enter the GPA directly. You can switch back anytime, but course-wise grades will be lost then."
              >
                <Button variant={!fixGPA ? "outline" : "default"}>
                  <span>
                    <SquarePen className="size-3.5" />
                  </span>
                  <span className="hidden md:block">Manual Input</span>
                </Button>
              </ResetDialog>
              <ResetDialog
                onConfirm={handleCourseWiseInput}
                title="Switch to Course-Wise Input?"
                description="This will exit manual mode and allow you to select grades for each course individually. The GPA will be recalculated based on the selected grades."
              >
                <Button variant={fixGPA ? "outline" : "default"}>
                  <span>
                    <PenOff className="size-3.5" />
                  </span>
                  <span className="hidden md:block">Course-Wise Input</span>
                </Button>
              </ResetDialog>
            </div>
          </div>
        </div>
        {semester.subjects.map(renderSubjectRow)}
      </CardContent>
    </Card>
  );
};

export default SemesterCard;
