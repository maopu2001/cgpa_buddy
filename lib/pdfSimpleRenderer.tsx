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
import { SimplePayload } from "./pdfSchemas";

interface YearGroup {
  yearLabel: string;
  semesters: Array<{
    name: string;
    gpa: number;
    credits: number;
    earnedCredits: number;
  }>;
}

export interface SimpleSummarySemester {
  name: string;
  gpa: number;
  credits: number;
  earnedCredits?: number;
}

export interface SimpleSummaryPageData {
  title?: string;
  generatedAt: string;
  semesters: SimpleSummarySemester[];
  totalCredits?: number;
  totalCreditsEarned?: number;
  cgpa?: number;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingHorizontal: 44,
    paddingBottom: 86,
    fontSize: 10,
    color: "#1a1a1a",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#333342",
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#333342",
    minHeight: 24,
  },
  headerRow: {
    flexDirection: "row",
    minHeight: 24,
  },
  cellTitle: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: "#333342",
  },
  cellGpa: {
    width: 80,
    textAlign: "center",
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: "#333342",
  },
  cellCredits: {
    width: 80,
    textAlign: "center",
    paddingVertical: 6,
  },
  bold: {
    fontWeight: 700,
  },
  totals: {
    marginTop: 20,
    gap: 6,
  },
  totalsText: {
    fontSize: 12,
  },
  totalsCgpa: {
    fontSize: 13,
    fontWeight: 700,
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

function splitSemesterName(name: string): { yearLabel: string } {
  const match = name.match(/^(.*?Year)\s+(.*Semester)$/i);
  if (match) {
    return {
      yearLabel: match[1].trim(),
    };
  }

  return {
    yearLabel: "Uncategorized Year",
  };
}

function formatTotalCredit(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function buildYearGroups(semesters: SimpleSummarySemester[]): YearGroup[] {
  const yearMap = new Map<string, YearGroup>();

  for (const semester of semesters) {
    const { yearLabel } = splitSemesterName(semester.name);
    const existing = yearMap.get(yearLabel);
    const normalized = {
      name: semester.name,
      gpa: semester.gpa,
      credits: semester.credits,
      earnedCredits:
        semester.earnedCredits ?? (semester.gpa > 0 ? semester.credits : 0),
    };

    if (!existing) {
      yearMap.set(yearLabel, {
        yearLabel,
        semesters: [normalized],
      });
      continue;
    }

    existing.semesters.push(normalized);
  }

  return Array.from(yearMap.values());
}

function buildSimpleSummaryRows(yearGroups: YearGroup[]) {
  const rows: Array<{
    label: string;
    gpaText: string;
    creditsText: string;
    bold?: boolean;
  }> = [];

  for (const group of yearGroups) {
    let yearCredits = 0;
    let yearCreditsEarned = 0;
    let yearPoints = 0;

    for (const semester of group.semesters.slice(0, 2)) {
      yearCredits += semester.credits;
      yearCreditsEarned += semester.earnedCredits;
      yearPoints += semester.gpa * semester.credits;

      rows.push({
        label: semester.name,
        gpaText: semester.gpa.toFixed(2),
        creditsText: semester.credits.toFixed(1),
      });
    }

    const yearGpa = yearCredits > 0 ? yearPoints / yearCredits : 0;
    rows.push({
      label: `${group.yearLabel} Summary`,
      gpaText: yearGpa.toFixed(2),
      creditsText: `${yearCreditsEarned.toFixed(1)} / ${formatTotalCredit(yearCredits)}`,
      bold: true,
    });
  }

  return rows;
}

export function SimpleSummaryPage({ data }: { data: SimpleSummaryPageData }) {
  const yearGroups = buildYearGroups(data.semesters);
  const rows = buildSimpleSummaryRows(yearGroups);

  const totalCredits =
    data.totalCredits ??
    data.semesters.reduce((sum, semester) => sum + semester.credits, 0);
  const totalPoints = data.semesters.reduce(
    (sum, semester) => sum + semester.gpa * semester.credits,
    0,
  );
  const totalCreditsEarned =
    data.totalCreditsEarned ??
    data.semesters.reduce(
      (sum, semester) =>
        sum +
        (semester.earnedCredits ?? (semester.gpa > 0 ? semester.credits : 0)),
      0,
    );
  const cgpa = data.cgpa ?? (totalCredits > 0 ? totalPoints / totalCredits : 0);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{data.title ?? "Simple CGPA Summary"}</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.cellTitle, styles.bold]}>Semester Title</Text>
          <Text style={[styles.cellGpa, styles.bold]}>GPA</Text>
          <Text style={[styles.cellCredits, styles.bold]}>Credits</Text>
        </View>

        {rows.map((row, index) => (
          <View style={styles.row} key={`${row.label}-${index}`}>
            <Text
              style={
                row.bold ? [styles.cellTitle, styles.bold] : styles.cellTitle
              }
            >
              {row.label}
            </Text>
            <Text
              style={row.bold ? [styles.cellGpa, styles.bold] : styles.cellGpa}
            >
              {row.gpaText}
            </Text>
            <Text
              style={
                row.bold
                  ? [styles.cellCredits, styles.bold]
                  : styles.cellCredits
              }
            >
              {row.creditsText}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <Text style={styles.totalsText}>
          Total Credits: {totalCredits.toFixed(1)}
        </Text>
        <Text style={styles.totalsText}>
          Total Credits Earned: {totalCreditsEarned.toFixed(1)}
        </Text>
        <Text style={styles.totalsCgpa}>Overall CGPA: {cgpa.toFixed(2)}</Text>
      </View>

      <View style={styles.footer} fixed>
        <Text>
          Generated by CGPA Buddy at{" "}
          {new Date(data.generatedAt).toLocaleString()}.
        </Text>
        <Text>
          Developed By:{" "}
          <Link src="https://github.com/maopu2001" style={styles.link}>
            M. Aktaruzzaman Opu
          </Link>
        </Text>
      </View>
    </Page>
  );
}

export async function buildSimplePdf(
  payload: SimplePayload,
): Promise<Response> {
  const doc = (
    <Document>
      <SimpleSummaryPage
        data={{
          title: "Simple CGPA Summary",
          generatedAt: new Date().toISOString(),
          semesters: payload.semesters.map((semester) => ({
            name: semester.name,
            gpa: semester.gpa,
            credits: semester.credits,
          })),
        }}
      />
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  return makePdfResponse(new Uint8Array(buffer));
}
