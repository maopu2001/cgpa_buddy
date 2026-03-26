import { rmstu } from "@/data/rmstu";
import { buildBuiltinReport } from "@/lib/pdfBuiltin";
import { buildCustomReport } from "@/lib/pdfCustom";
import { buildSimplePdf } from "@/lib/pdfSimple";
import {
  builtinPayloadSchema,
  customPayloadSchema,
  simplePayloadSchema,
} from "@/lib/pdfSchemas";
import { renderTranscriptPdf } from "@/lib/pdfRenderer";

const sharedTranscriptOptions = {
  includeSummaryPage: true,
  useSimpleFooter: true,
  centerHeaderText: true,
} as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedSimple = simplePayloadSchema.safeParse(body);
    if (parsedSimple.success) {
      return buildSimplePdf(parsedSimple.data);
    }

    const parsedCustom = customPayloadSchema.safeParse(body);
    if (parsedCustom.success) {
      const completeReport = buildCustomReport(parsedCustom.data);
      return renderTranscriptPdf(completeReport, {
        headerLine1: "CGPA BUDDY CUSTOM REPORT",
        headerLine2: "(Semester Structure Defined by User)",
        transcriptLabel: (semester) =>
          `Transcript for ${semester.yearLabel} ${semester.semesterLabel}`,
        departmentLabel: () => "",
        ...sharedTranscriptOptions,
      });
    }

    const parsedBuiltin = builtinPayloadSchema.safeParse(body);
    if (!parsedBuiltin.success) {
      return Response.json(
        {
          error: "Invalid request payload",
          details: parsedBuiltin.error.flatten(),
        },
        { status: 400 },
      );
    }

    const deptCode = parsedBuiltin.data.deptCode.toUpperCase();
    if (!rmstu[deptCode]?.semesters.length) {
      return Response.json(
        {
          error: `Unsupported or missing department data for deptCode: ${deptCode}`,
        },
        { status: 400 },
      );
    }

    const completeReport = buildBuiltinReport(parsedBuiltin.data);
    return renderTranscriptPdf(completeReport, {
      headerLine1: "RANGAMATI SCIENCE AND TECHNOLOGY UNIVERSITY",
      headerLine2: "RANGAMATI - 4500, BANGLADESH",
      transcriptLabel: (semester) =>
        `Transcript for ${semester.yearLabel} ${semester.semesterLabel}`,
      departmentLabel: (report) => `Department of ${report.department.name}`,
      ...sharedTranscriptOptions,
    });
  } catch {
    return Response.json(
      {
        error:
          "Failed to generate PDF. Make sure the request body is valid JSON.",
      },
      { status: 500 },
    );
  }
}
