import { CustomPayload } from "@/lib/pdfSchemas";
import { CompleteCGPAReport } from "@/lib/pdfTypes";
import {
  buildCompleteReportFromSemesterWise,
  buildSemesterWiseSummary,
  ReportSemesterInput,
} from "./pdfBuiltin";

export function buildCustomReport(payload: CustomPayload): CompleteCGPAReport {
  const normalizedSemesters: ReportSemesterInput[] =
    payload.structure.semesters.map((semester) => ({
      code: semester.code,
      yearLabel: semester.year,
      semesterLabel: semester.semester,
      courses: semester.courses.map((course) => ({
        code: course.code,
        title: course.name,
        credit: course.credit,
      })),
    }));

  const semesterWiseSummary = buildSemesterWiseSummary(
    normalizedSemesters,
    payload.grades,
    payload.manualGPAs,
    payload.fixGPAMap,
  );

  return buildCompleteReportFromSemesterWise(
    semesterWiseSummary,
    {
      code: "CUSTOM",
      name: "Custom Structure",
      university: "CGPA Counter",
    },
    {},
  );
}
