// Grades map: subjectCode -> grade value (number) or null (not taken)
export type GradeMap = Record<string, number | null>;

export function calcSemesterGPA(
  subjects: { code: string; credit: number }[],
  grades: GradeMap
): { gpa: number; totalCredits: number; earnedCredits: number } {
  let totalPoints = 0;
  let totalCredits = 0;
  let earnedCredits = 0;

  for (const s of subjects) {
    const grade = grades[s.code];
    if (grade === null || grade === undefined) continue;
    totalCredits += s.credit;
    totalPoints += grade * s.credit;
    if (grade > 0) earnedCredits += s.credit;
  }

  return {
    gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits,
    earnedCredits,
  };
}

export function calcCGPA(
  semesters: { subjects: { code: string; credit: number }[] }[],
  grades: GradeMap
): { cgpa: number; totalCredits: number; earnedCredits: number; totalPossibleCredits: number } {
  let totalPoints = 0;
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalPossibleCredits = 0;

  for (const sem of semesters) {
    for (const s of sem.subjects) {
      totalPossibleCredits += s.credit;
      const grade = grades[s.code];
      if (grade === null || grade === undefined) continue;
      totalCredits += s.credit;
      totalPoints += grade * s.credit;
      if (grade > 0) earnedCredits += s.credit;
    }
  }

  return {
    cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits,
    earnedCredits,
    totalPossibleCredits,
  };
}

export function getGradeDistribution(grades: GradeMap): Record<string, number> {
  const labels: Record<number, string> = {
    4: "A+", 3.75: "A", 3.5: "A-", 3.25: "B+", 3: "B",
    2.75: "B-", 2.5: "C+", 2.25: "C", 2: "D", 0: "F",
  };
  const dist: Record<string, number> = {};
  for (const v of Object.values(grades)) {
    if (v === null || v === undefined) continue;
    const label = labels[v] ?? String(v);
    dist[label] = (dist[label] || 0) + 1;
  }
  return dist;
}

export function getGPAColor(gpa: number): string {
  if (gpa >= 3.75) return "text-emerald-500";
  if (gpa >= 3.25) return "text-blue-500";
  if (gpa >= 2.75) return "text-amber-500";
  if (gpa >= 2.0) return "text-orange-500";
  return "text-red-500";
}

export function getGPABgColor(gpa: number): string {
  if (gpa >= 3.75) return "bg-emerald-500/10 border-emerald-500/30";
  if (gpa >= 3.25) return "bg-blue-500/10 border-blue-500/30";
  if (gpa >= 2.75) return "bg-amber-500/10 border-amber-500/30";
  if (gpa >= 2.0) return "bg-orange-500/10 border-orange-500/30";
  return "bg-red-500/10 border-red-500/30";
}
