export interface CourseReportRow {
  code: string;
  title: string;
  credit: number;
  grade: number | null;
  letterGrade: string;
  earnedGradePoints: number;
  earnedCredits: number;
}

export interface SemesterSummary {
  code: string;
  yearLabel: string;
  semesterLabel: string;
  gpa: number;
  attemptedCredits: number;
  earnedCredits: number;
  gradedCourses: number;
  totalCourses: number;
  totalGradePoints: number;
  manualMode: boolean;
  manualGPA: number | null;
  courses: CourseReportRow[];
}

export interface YearSummary {
  yearLabel: string;
  cgpa: number;
  attemptedCredits: number;
  earnedCredits: number;
  gradedCourses: number;
  totalCourses: number;
  totalGradePoints: number;
}

export interface TotalSummary {
  cgpa: number;
  attemptedCredits: number;
  earnedCredits: number;
  totalPossibleCredits: number;
  gradedCourses: number;
  totalCourses: number;
  totalGradePoints: number;
}

export interface CompleteCGPAReport {
  generatedAt: string;
  department: {
    code: string;
    name: string;
    university: string;
  };
  electives: Record<string, string>;
  courses: CourseReportRow[];
  semesterWiseSummary: SemesterSummary[];
  yearWiseSummary: YearSummary[];
  totalSummary: TotalSummary;
}

export interface TranscriptRenderOptions {
  headerLine1: string;
  headerLine2: string;
  transcriptLabel: (semester: SemesterSummary) => string;
  departmentLabel: (report: CompleteCGPAReport) => string;
  includeSummaryPage?: boolean;
  useSimpleFooter?: boolean;
  centerHeaderText?: boolean;
}
