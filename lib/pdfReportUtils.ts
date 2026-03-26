import { CourseReportRow, SemesterSummary, YearSummary } from "./pdfTypes";

interface CourseInput {
  code: string;
  title: string;
  credit: number;
}

type GradeLookup = Record<string, number | null | undefined>;

function gradePointToLetter(grade: number | null): string {
  if (grade === null) return "N/A";
  if (grade >= 4) return "A+";
  if (grade >= 3.75) return "A";
  if (grade >= 3.5) return "A-";
  if (grade >= 3.25) return "B+";
  if (grade >= 3) return "B";
  if (grade >= 2.75) return "B-";
  if (grade >= 2.5) return "C+";
  if (grade >= 2.25) return "C";
  if (grade >= 2) return "D";
  return "F";
}

function mapCoursesWithGrades(
  courses: CourseInput[],
  grades: GradeLookup,
): CourseReportRow[] {
  return courses.map((course) => {
    const grade = grades[course.code];
    const normalizedGrade =
      grade === undefined || grade === null ? null : Number(grade);

    return {
      code: course.code,
      title: course.title,
      credit: course.credit,
      grade: normalizedGrade,
      letterGrade: gradePointToLetter(normalizedGrade),
      earnedGradePoints:
        normalizedGrade === null ? 0 : normalizedGrade * course.credit,
      earnedCredits:
        normalizedGrade !== null && normalizedGrade > 0 ? course.credit : 0,
    };
  });
}

export function buildSemesterSummary(
  semester: {
    code: string;
    yearLabel: string;
    semesterLabel: string;
    courses: CourseInput[];
  },
  grades: GradeLookup,
  manualGPAs: Record<string, number>,
  fixGPAMap: Record<string, boolean>,
): SemesterSummary {
  const courses = mapCoursesWithGrades(semester.courses, grades);
  const manualMode =
    fixGPAMap[semester.code] && manualGPAs[semester.code] !== undefined;
  const manualGPA = manualMode ? manualGPAs[semester.code] : null;

  const totalCourses = courses.length;
  const gradedCourses = courses.filter(
    (course) => course.grade !== null,
  ).length;
  const semesterTotalCredits = courses.reduce(
    (sum, course) => sum + course.credit,
    0,
  );

  if (manualMode && manualGPA !== null && manualGPA > 0) {
    return {
      code: semester.code,
      yearLabel: semester.yearLabel,
      semesterLabel: semester.semesterLabel,
      gpa: manualGPA,
      attemptedCredits: semesterTotalCredits,
      earnedCredits: semesterTotalCredits,
      gradedCourses,
      totalCourses,
      totalGradePoints: manualGPA * semesterTotalCredits,
      manualMode: true,
      manualGPA,
      courses,
    };
  }

  const attemptedCredits = courses.reduce((sum, course) => {
    if (course.grade === null) return sum;
    return sum + course.credit;
  }, 0);
  const totalGradePoints = courses.reduce(
    (sum, course) => sum + course.earnedGradePoints,
    0,
  );
  const earnedCredits = courses.reduce(
    (sum, course) => sum + course.earnedCredits,
    0,
  );

  return {
    code: semester.code,
    yearLabel: semester.yearLabel,
    semesterLabel: semester.semesterLabel,
    gpa: attemptedCredits > 0 ? totalGradePoints / attemptedCredits : 0,
    attemptedCredits,
    earnedCredits,
    gradedCourses,
    totalCourses,
    totalGradePoints,
    manualMode: false,
    manualGPA: null,
    courses,
  };
}

export function aggregateYearSummary(
  semesterWiseSummary: SemesterSummary[],
): YearSummary[] {
  const yearAccumulator = new Map<string, YearSummary>();
  for (const semester of semesterWiseSummary) {
    const existing = yearAccumulator.get(semester.yearLabel);
    if (!existing) {
      yearAccumulator.set(semester.yearLabel, {
        yearLabel: semester.yearLabel,
        cgpa: 0,
        attemptedCredits: semester.attemptedCredits,
        earnedCredits: semester.earnedCredits,
        gradedCourses: semester.gradedCourses,
        totalCourses: semester.totalCourses,
        totalGradePoints: semester.totalGradePoints,
      });
      continue;
    }

    existing.attemptedCredits += semester.attemptedCredits;
    existing.earnedCredits += semester.earnedCredits;
    existing.gradedCourses += semester.gradedCourses;
    existing.totalCourses += semester.totalCourses;
    existing.totalGradePoints += semester.totalGradePoints;
  }

  return Array.from(yearAccumulator.values())
    .map((year) => ({
      ...year,
      cgpa:
        year.attemptedCredits > 0
          ? year.totalGradePoints / year.attemptedCredits
          : 0,
    }))
    .sort((a, b) => a.yearLabel.localeCompare(b.yearLabel));
}
