import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { makePdfResponse } from "./pdfResponse";
import { SimpleSummaryPage } from "./pdfSimpleRenderer";
import {
  CompleteCGPAReport,
  SemesterSummary,
  TranscriptRenderOptions,
} from "./pdfTypes";

function gpaToResultLetter(gpa: number): string {
  if (gpa >= 4) return "A+";
  if (gpa >= 3.75) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.25) return "B+";
  if (gpa >= 3) return "B";
  if (gpa >= 2.75) return "B-";
  if (gpa >= 2.5) return "C+";
  if (gpa >= 2.25) return "C";
  if (gpa >= 2) return "D";
  return "F";
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingHorizontal: 44,
    paddingBottom: 86,
    fontSize: 10,
    color: "#1a1a1a",
  },
  centerText: {
    textAlign: "center",
  },
  headerLine1: {
    fontSize: 14,
    fontWeight: 700,
  },
  headerLine2: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 4,
  },
  department: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 8,
  },
  transcript: {
    fontSize: 10,
    marginTop: 8,
  },
  table: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#333342",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#333342",
    minHeight: 24,
  },
  tableHeaderRow: {
    flexDirection: "row",
    minHeight: 24,
  },
  colCourse: {
    width: 90,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: "#333342",
  },
  colTitle: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: "#333342",
  },
  colLetter: {
    width: 68,
    textAlign: "center",
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: "#333342",
  },
  colPoint: {
    width: 68,
    textAlign: "center",
    paddingVertical: 6,
  },
  bold: {
    fontWeight: 700,
  },
  statsBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 18,
  },
  statsLeft: {
    flex: 3,
    gap: 4,
  },
  statsRight: {
    flex: 2,
    alignItems: "flex-start",
  },
  statsLine: {
    fontSize: 11,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 44,
    right: 44,
    gap: 3,
    fontSize: 10,
  },
  link: {
    color: "#0d4ccc",
    textDecoration: "none",
  },
});

function TranscriptPage({
  semester,
  report,
  options,
}: {
  semester: SemesterSummary;
  report: CompleteCGPAReport;
  options: TranscriptRenderOptions;
}) {
  const centered = options.centerHeaderText === true;
  const useSimpleFooter = options.useSimpleFooter === true;
  const departmentText = options.departmentLabel(report)?.trim();

  return (
    <Page size="A4" style={styles.page}>
      <Text
        style={
          centered
            ? [styles.headerLine1, styles.centerText]
            : styles.headerLine1
        }
      >
        {options.headerLine1}
      </Text>
      <Text
        style={
          centered
            ? [styles.headerLine2, styles.centerText]
            : styles.headerLine2
        }
      >
        {options.headerLine2}
      </Text>
      {departmentText ? (
        <Text
          style={
            centered
              ? [styles.department, styles.centerText]
              : styles.department
          }
        >
          {departmentText}
        </Text>
      ) : null}
      <Text
        style={
          centered ? [styles.transcript, styles.centerText] : styles.transcript
        }
      >
        {options.transcriptLabel(semester)}
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.colCourse, styles.bold]}>Course Code</Text>
          <Text style={[styles.colTitle, styles.bold]}>Title of Course</Text>
          <Text style={[styles.colLetter, styles.bold]}>Letter Grade</Text>
          <Text style={[styles.colPoint, styles.bold]}>Grade Point</Text>
        </View>

        {semester.courses.map((course) => (
          <View style={styles.tableRow} key={`${semester.code}-${course.code}`}>
            <Text style={styles.colCourse}>
              {course.code.replace("-", " ")}
            </Text>
            <Text style={styles.colTitle}>{course.title}</Text>
            <Text style={styles.colLetter}>{course.letterGrade}</Text>
            <Text style={styles.colPoint}>
              {course.grade === null ? "-" : course.grade.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.statsBlock}>
        <View style={styles.statsLeft}>
          <Text style={styles.statsLine}>
            Credit Taken : {semester.attemptedCredits.toFixed(1)}
          </Text>
          <Text style={styles.statsLine}>
            Credit Earned : {semester.earnedCredits.toFixed(1)}
          </Text>
          <Text style={[styles.statsLine, styles.bold]}>
            Grade Point Average (GPA): {semester.gpa.toFixed(2)}
          </Text>
        </View>
        <View style={styles.statsRight}>
          <Text style={styles.statsLine}>
            Result : {gpaToResultLetter(semester.gpa)}
          </Text>
        </View>
      </View>

      {useSimpleFooter ? (
        <View style={styles.footer} fixed>
          <Text>
            Generated by CGPA Buddy at{" "}
            {new Date(report.generatedAt).toLocaleString()}.
          </Text>
          <Text>
            Developed By:{" "}
            <Link src="https://github.com/maopu2001" style={styles.link}>
              M. Aktaruzzaman Opu
            </Link>
          </Text>
        </View>
      ) : (
        <View style={styles.footer} fixed>
          <Text>
            Overall CGPA: {report.totalSummary.cgpa.toFixed(2)} | Earned
            Credits: {report.totalSummary.earnedCredits.toFixed(1)} /{" "}
            {report.totalSummary.totalPossibleCredits.toFixed(1)}
          </Text>
        </View>
      )}
    </Page>
  );
}

export async function renderTranscriptPdf(
  completeReport: CompleteCGPAReport,
  options: TranscriptRenderOptions,
): Promise<Response> {
  const doc = (
    <Document>
      {completeReport.semesterWiseSummary.map((semester) => (
        <TranscriptPage
          key={semester.code}
          semester={semester}
          report={completeReport}
          options={options}
        />
      ))}

      {options.includeSummaryPage ? (
        <SimpleSummaryPage
          data={{
            title: "Overall CGPA Summary",
            generatedAt: completeReport.generatedAt,
            semesters: completeReport.semesterWiseSummary.map((semester) => ({
              name: `${semester.yearLabel} ${semester.semesterLabel}`,
              gpa: semester.gpa,
              credits: semester.attemptedCredits,
              earnedCredits: semester.earnedCredits,
            })),
            totalCredits: completeReport.totalSummary.attemptedCredits,
            totalCreditsEarned: completeReport.totalSummary.earnedCredits,
            cgpa: completeReport.totalSummary.cgpa,
          }}
        />
      ) : null}
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  return makePdfResponse(new Uint8Array(buffer));
}
