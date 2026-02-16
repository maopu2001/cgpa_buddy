// Grades map: subjectCode -> grade value (number) or null (not taken)
export type GradeMap = Record<string, number | null>;
export type ManualGPAs = Record<string, number>; // semester code -> manual GPA
export type FixGPAMap = Record<string, boolean>; // semester code -> fixGPA state

export function calcSemesterGPA(
  subjects: { code: string; credit: number }[],
  grades: GradeMap,
  semesterCode?: string,
  manualGPAs?: ManualGPAs,
  fixGPAMap?: FixGPAMap,
): { gpa: number; totalCredits: number; earnedCredits: number } {
  // If this semester is in manual mode, return manual GPA with all credits
  if (
    semesterCode &&
    fixGPAMap?.[semesterCode] &&
    manualGPAs?.[semesterCode] !== undefined
  ) {
    const manualGPA = manualGPAs[semesterCode];
    const allCredits = subjects.reduce((sum, s) => sum + s.credit, 0);

    // If manual GPA is 0 or invalid, ignore this semester (return zeros)
    if (manualGPA <= 0) {
      return {
        gpa: 0,
        totalCredits: 0,
        earnedCredits: 0,
      };
    }

    return {
      gpa: manualGPA,
      totalCredits: allCredits,
      earnedCredits: allCredits,
    };
  }

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
  semesters: { code: string; subjects: { code: string; credit: number }[] }[],
  grades: GradeMap,
  manualGPAs?: ManualGPAs,
  fixGPAMap?: FixGPAMap,
): {
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  totalPossibleCredits: number;
} {
  let totalPoints = 0;
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalPossibleCredits = 0;

  for (const sem of semesters) {
    const semesterTotalCredits = sem.subjects.reduce(
      (sum, s) => sum + s.credit,
      0,
    );
    totalPossibleCredits += semesterTotalCredits;

    // If semester is in manual mode, use manual GPA
    if (fixGPAMap?.[sem.code] && manualGPAs?.[sem.code] !== undefined) {
      const manualGPA = manualGPAs[sem.code];

      // Skip this semester if manual GPA is 0 or invalid (ignore it in CGPA calculation)
      if (manualGPA <= 0) {
        continue;
      }

      totalCredits += semesterTotalCredits;
      earnedCredits += semesterTotalCredits;
      totalPoints += manualGPA * semesterTotalCredits;
    } else {
      // Otherwise, calculate from individual subject grades
      for (const s of sem.subjects) {
        const grade = grades[s.code];
        if (grade === null || grade === undefined) continue;
        totalCredits += s.credit;
        totalPoints += grade * s.credit;
        if (grade > 0) earnedCredits += s.credit;
      }
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
    4: "A+",
    3.75: "A",
    3.5: "A-",
    3.25: "B+",
    3: "B",
    2.75: "B-",
    2.5: "C+",
    2.25: "C",
    2: "D",
    0: "F",
  };
  const dist: Record<string, number> = {};
  for (const v of Object.values(grades)) {
    if (v === null || v === undefined) continue;
    const label = labels[v] ?? String(v);
    dist[label] = (dist[label] || 0) + 1;
  }
  return dist;
}

export function getGPABgColor(gpa: number): string {
  if (gpa >= 3.75) return "bg-emerald-500/10 border-emerald-500/30";
  if (gpa >= 3.25) return "bg-blue-500/10 border-blue-500/30";
  if (gpa >= 2.75) return "bg-amber-500/10 border-amber-500/30";
  if (gpa >= 2.0) return "bg-orange-500/10 border-orange-500/30";
  return "bg-red-500/10 border-red-500/30";
}
