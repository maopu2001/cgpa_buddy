import { Semester } from "@/data/rmstu";
import {
  GradeMap,
  calcSemesterGPA,
  calcCGPA,
  getGradeDistribution,
  getGPABgColor,
  ManualGPAs,
  FixGPAMap,
} from "@/lib/cgpa";
import CGPAGauge from "./CGPAGauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  semesters: Semester[];
  grades: GradeMap;
  manualGPAs?: ManualGPAs;
  fixGPAMap?: FixGPAMap;
}

const GRADE_COLORS: Record<string, string> = {
  "A+": "#10b981",
  A: "#22c55e",
  "A-": "#84cc16",
  "B+": "#3b82f6",
  B: "#6366f1",
  "B-": "#8b5cf6",
  "C+": "#f59e0b",
  C: "#f97316",
  D: "#ef4444",
  F: "#dc2626",
};

const ResultsDashboard = ({
  semesters,
  grades,
  manualGPAs,
  fixGPAMap,
}: Props) => {
  const overall = calcCGPA(semesters, grades, manualGPAs, fixGPAMap);
  const distribution = getGradeDistribution(grades);
  const chartData = Object.entries(distribution).map(([grade, count]) => ({
    grade,
    count,
    fill: GRADE_COLORS[grade] || "#94a3b8",
  }));

  const semesterGPAs = semesters.map((sem) => {
    const result = calcSemesterGPA(
      sem.subjects,
      grades,
      sem.code,
      manualGPAs,
      fixGPAMap,
    );
    const totalPossibleCredits = sem.subjects.reduce(
      (sum, s) => sum + s.credit,
      0,
    );
    return { semester: sem, label: sem.code, totalPossibleCredits, ...result };
  });

  // Group semesters by year
  const yearGroups = semesterGPAs.reduce(
    (acc, semData) => {
      const year = semData.semester.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(semData);
      return acc;
    },
    {} as Record<string, typeof semesterGPAs>,
  );

  // Calculate year-wise GPA
  const yearWiseData = Object.entries(yearGroups).map(([year, sems]) => {
    const totalPoints = sems.reduce(
      (sum, s) => sum + s.gpa * s.totalCredits,
      0,
    );
    const totalCredits = sems.reduce((sum, s) => sum + s.totalCredits, 0);
    const earnedCredits = sems.reduce((sum, s) => sum + s.earnedCredits, 0);
    const totalPossibleCredits = sems.reduce(
      (sum, s) => sum + s.totalPossibleCredits,
      0,
    );
    const yearGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return {
      year,
      yearGPA,
      totalCredits,
      earnedCredits,
      totalPossibleCredits,
      semesters: sems,
    };
  });

  const filledSemesters = semesterGPAs.filter(
    (s) => s.earnedCredits > 0,
  ).length;

  return (
    <div className="space-y-6">
      {/* Top summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1 flex items-center justify-center py-6">
          <CGPAGauge value={overall.cgpa} />
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Semester Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={yearWiseData.map((y) => y.year)}
              className="space-y-2"
            >
              {yearWiseData.map(
                ({
                  year,
                  yearGPA,
                  totalPossibleCredits,
                  earnedCredits,
                  semesters,
                }) => (
                  <AccordionItem
                    key={year}
                    value={year}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">{year}</span>
                          {earnedCredits > 0 && (
                            <span
                              className={`text-lg font-bold ${
                                yearGPA >= 3.75
                                  ? "text-emerald-500"
                                  : yearGPA >= 3.25
                                    ? "text-blue-500"
                                    : yearGPA >= 2.75
                                      ? "text-amber-500"
                                      : yearGPA >= 2.0
                                        ? "text-orange-500"
                                        : "text-red-500"
                              }`}
                            >
                              {yearGPA.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {earnedCredits}/{totalPossibleCredits} credits
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        {semesters.map((s) => (
                          <div
                            key={s.label}
                            className={`rounded-lg border p-3 text-center transition-colors ${
                              s.earnedCredits > 0
                                ? getGPABgColor(s.gpa)
                                : "bg-muted/50"
                            }`}
                          >
                            <p className="text-xs text-muted-foreground font-mono">
                              {s.semester.semester}
                            </p>
                            <p className="mt-1 text-xl font-bold text-foreground">
                              {s.earnedCredits > 0 ? s.gpa.toFixed(2) : "—"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {s.earnedCredits}/{s.totalPossibleCredits} credits
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ),
              )}
            </Accordion>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">
                  {overall.earnedCredits}
                </strong>{" "}
                / {overall.totalPossibleCredits} credits
              </span>
              <span>
                <strong className="text-foreground">{filledSemesters}</strong> /{" "}
                {semesters.length} semesters
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade distribution */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsDashboard;
