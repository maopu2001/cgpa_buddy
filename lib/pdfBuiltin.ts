import {
  aggregateYearSummary,
  buildSemesterSummary,
} from "@/lib/pdfReportUtils";
import { rmstu, Subject } from "@/data/rmstu";
import { calcCGPA } from "./cgpa";
import { BuiltinPayload } from "./pdfSchemas";
import { CompleteCGPAReport, SemesterSummary, TotalSummary } from "./pdfTypes";

export interface ReportSemesterInput {
  code: string;
  yearLabel: string;
  semesterLabel: string;
  courses: Array<{
    code: string;
    title: string;
    credit: number;
  }>;
}

function resolveElectiveSubject(
  code: string,
  electives: BuiltinPayload["electives"],
  deptCode: string,
): Subject | null {
  const selectedCode = electives[code];
  if (!selectedCode) return null;

  const department = rmstu[deptCode];
  if (!department?.electives) return null;

  const allElectives = [
    ...department.electives.option_I,
    ...department.electives.option_II,
  ];

  return allElectives.find((subject) => subject.code === selectedCode) ?? null;
}

export function buildSemesterWiseSummary(
  semesters: ReportSemesterInput[],
  grades: BuiltinPayload["grades"],
  manualGPAs: BuiltinPayload["manualGPAs"],
  fixGPAMap: BuiltinPayload["fixGPAMap"],
): SemesterSummary[] {
  return semesters.map((semester) =>
    buildSemesterSummary(semester, grades, manualGPAs, fixGPAMap),
  );
}

export function buildTotalSummaryFromSemesterWise(
  semesterWiseSummary: SemesterSummary[],
  totalSummaryOverride?: Partial<TotalSummary>,
): TotalSummary {
  const courses = semesterWiseSummary.flatMap((semester) => semester.courses);
  const attemptedCredits = semesterWiseSummary.reduce(
    (sum, semester) => sum + semester.attemptedCredits,
    0,
  );
  const earnedCredits = semesterWiseSummary.reduce(
    (sum, semester) => sum + semester.earnedCredits,
    0,
  );
  const totalGradePoints = semesterWiseSummary.reduce(
    (sum, semester) => sum + semester.totalGradePoints,
    0,
  );
  const totalPossibleCredits = courses.reduce(
    (sum, course) => sum + course.credit,
    0,
  );

  return {
    cgpa:
      totalSummaryOverride?.cgpa ??
      (attemptedCredits > 0 ? totalGradePoints / attemptedCredits : 0),
    attemptedCredits:
      totalSummaryOverride?.attemptedCredits ?? attemptedCredits,
    earnedCredits: totalSummaryOverride?.earnedCredits ?? earnedCredits,
    totalPossibleCredits:
      totalSummaryOverride?.totalPossibleCredits ?? totalPossibleCredits,
    gradedCourses:
      totalSummaryOverride?.gradedCourses ??
      courses.filter((course) => course.grade !== null).length,
    totalCourses: totalSummaryOverride?.totalCourses ?? courses.length,
    totalGradePoints:
      totalSummaryOverride?.totalGradePoints ?? totalGradePoints,
  };
}

export function buildCompleteReportFromSemesterWise(
  semesterWiseSummary: SemesterSummary[],
  department: CompleteCGPAReport["department"],
  electives: CompleteCGPAReport["electives"],
  totalSummaryOverride?: Partial<TotalSummary>,
): CompleteCGPAReport {
  const courses = semesterWiseSummary.flatMap((semester) => semester.courses);

  return {
    generatedAt: new Date().toISOString(),
    department,
    electives,
    courses,
    semesterWiseSummary,
    yearWiseSummary: aggregateYearSummary(semesterWiseSummary),
    totalSummary: buildTotalSummaryFromSemesterWise(
      semesterWiseSummary,
      totalSummaryOverride,
    ),
  };
}

export function buildBuiltinReport(
  payload: BuiltinPayload,
): CompleteCGPAReport {
  const deptCode = payload.deptCode.toUpperCase();
  const department = rmstu[deptCode];

  if (!department || department.semesters.length === 0) {
    throw new Error(
      `Unsupported or missing department data for deptCode: ${deptCode}`,
    );
  }

  const semesters = department.semesters.map((semester) => ({
    ...semester,
    subjects: semester.subjects.map((subject) => {
      if (!subject.code.startsWith("ELECTIVE-")) {
        return subject;
      }

      return (
        resolveElectiveSubject(subject.code, payload.electives, deptCode) ??
        subject
      );
    }),
  }));

  const cgpaResult = calcCGPA(
    semesters,
    payload.grades,
    payload.manualGPAs,
    payload.fixGPAMap,
  );

  const normalizedSemesters: ReportSemesterInput[] = semesters.map(
    (semester) => ({
      code: semester.code,
      yearLabel: semester.year,
      semesterLabel: semester.semester,
      courses: semester.subjects.map((subject) => ({
        code: subject.code,
        title: subject.name,
        credit: subject.credit,
      })),
    }),
  );

  const semesterWiseSummary = buildSemesterWiseSummary(
    normalizedSemesters,
    payload.grades,
    payload.manualGPAs,
    payload.fixGPAMap,
  );

  return buildCompleteReportFromSemesterWise(
    semesterWiseSummary,
    {
      code: department.deptCode,
      name: department.dept,
      university: department.university,
    },
    payload.electives,
    {
      cgpa: cgpaResult.cgpa,
      attemptedCredits: cgpaResult.totalCredits,
      earnedCredits: cgpaResult.earnedCredits,
      totalPossibleCredits: cgpaResult.totalPossibleCredits,
    },
  );
}
