import { Subject, GRADE_SCALE, Semester, Electives } from "@/data/rmstu";
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

interface Props {
  semester: Semester;
  grades: GradeMap;
  electives?: Electives;
  electiveSelections: ElectiveSelection;
  onGradeChange: (code: string, value: number | null) => void;
  onElectiveChange: (electiveCode: string, subjectCode: string) => void;
  gpa: number;
}

const SemesterCard = ({
  semester,
  grades,
  electives,
  electiveSelections,
  onGradeChange,
  onElectiveChange,
  gpa,
}: Props) => {
  const isElective = (code: string) => code.startsWith("ELECTIVE");
  const filledCount = semester.subjects.filter(
    (s) => grades[s.code] !== undefined && grades[s.code] !== null,
  ).length;
  const totalCredits = semester.subjects.reduce((a, s) => a + s.credit, 0);
  const earnedCredits = semester.subjects
    .filter((s) => grades[s.code] !== undefined && grades[s.code] !== null)
    .reduce((a, s) => a + s.credit, 0);

  const getElectiveOptions = (code: string) => {
    if (!electives) return [];
    if (code.includes("ELECTIVE-2") || code === "ELECTIVE-2-LAB")
      return electives.option_II;
    return [...electives.option_I, ...electives.option_II];
  };

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
                  {selectedElective || subject.code}
                </Badge>
                <span>{subject.credit} Credits</span>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedElective
                    ? getElectiveOptions(subject.code).find(
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
              >
                <SelectTrigger className="h-8 text-xs mt-1.5">
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  {getElectiveOptions(subject.code).map((e) => (
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
                  {subject.code}
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
                className="px-3 h-9 font-medium grow"
              >
                {gradeLabel}
              </Button>
            );
          })}

          <Button
            variant={grades[subject.code] === null ? "default" : "outline"}
            size="sm"
            onClick={() => onGradeChange(subject.code, null)}
            className="px-3 h-9 font-medium text-xs grow"
          >
            Skip
          </Button>
        </div>
      </div>
    );
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
            <p className="text-2xl font-bold">{gpa.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">GPA</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {semester.subjects.map(renderSubjectRow)}
      </CardContent>
    </Card>
  );
};

export default SemesterCard;
