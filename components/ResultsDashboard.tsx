import { Semester } from "@/data/rmstu";
import { GradeMap, calcSemesterGPA, calcCGPA, getGradeDistribution, getGPABgColor } from "@/lib/cgpa";
import CGPAGauge from "./CGPAGauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  semesters: Semester[];
  grades: GradeMap;
}

const GRADE_COLORS: Record<string, string> = {
  "A+": "#10b981", A: "#22c55e", "A-": "#84cc16",
  "B+": "#3b82f6", B: "#6366f1", "B-": "#8b5cf6",
  "C+": "#f59e0b", C: "#f97316", D: "#ef4444", F: "#dc2626",
};

const ResultsDashboard = ({ semesters, grades }: Props) => {
  const overall = calcCGPA(semesters, grades);
  const distribution = getGradeDistribution(grades);
  const chartData = Object.entries(distribution).map(([grade, count]) => ({
    grade,
    count,
    fill: GRADE_COLORS[grade] || "#94a3b8",
  }));

  const semesterGPAs = semesters.map((sem) => {
    const result = calcSemesterGPA(sem.subjects, grades);
    return { label: sem.code, ...result };
  });

  const filledSemesters = semesterGPAs.filter((s) => s.totalCredits > 0).length;

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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {semesterGPAs.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-lg border p-3 text-center transition-colors ${
                    s.totalCredits > 0 ? getGPABgColor(s.gpa) : "bg-muted/50"
                  }`}
                >
                  <p className="text-xs text-muted-foreground font-mono">{s.label}</p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {s.totalCredits > 0 ? s.gpa.toFixed(2) : "—"}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{overall.earnedCredits}</strong> / {overall.totalPossibleCredits} credits
              </span>
              <span>
                <strong className="text-foreground">{filledSemesters}</strong> / {semesters.length} semesters
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
