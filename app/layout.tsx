import "./globals.css";
import Providers from "@/components/Providers";
import type { Metadata, Viewport } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const metadataBase = (() => {
  try {
    return new URL(siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
})();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "CGPA Buddy",
    template: "%s | CGPA Buddy",
  },
  description:
    "CGPA Buddy helps RMSTU and custom-structure students calculate GPA/CGPA, track semester performance, and export academic summaries.",
  applicationName: "CGPA Buddy",
  keywords: [
    "CGPA calculator",
    "cgpa calculator",
    "GPA calculator",
    "gpa calculator",
    "semester GPA calculator",
    "Semester GPA calculator",
    "cumulative GPA calculator",
    "Cumulative GPA calculator",
    "CGPA tracker",
    "cgpa tracker",
    "GPA tracker",
    "gpa tracker",
    "grade point calculator",
    "Grade point calculator",
    "university GPA tool",
    "University GPA tool",
    "student academic calculator",
    "Student academic calculator",
    "RMSTU",
    "RMSTU CGPA",
    "rmstu cgpa",
    "Rangamati Science and Technology University",
    "rangamati science and technology university",
    "RMSTU GPA calculator",
    "rmstu gpa calculator",
    "RMSTU result tool",
    "rmstu result tool",
    "custom CGPA calculator",
    "Custom CGPA calculator",
    "custom semester GPA",
    "Custom semester GPA",
    "semester wise CGPA",
    "Semester wise CGPA",
    "credit based CGPA",
    "Credit based CGPA",
    "Bangladesh CGPA calculator",
    "bangladesh cgpa calculator",
    "Bangladesh university CGPA",
    "bangladesh university cgpa",
    "academic performance tracker",
    "Academic performance tracker",
    "downloadable GPA summary",
    "Downloadable GPA summary",
    "transcript style CGPA report",
    "Transcript style CGPA report",
    "cgpa buddy",
    "CGPA Buddy",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "CGPA Buddy",
    siteName: "CGPA Buddy",
    description:
      "Calculate and track GPA/CGPA for RMSTU and custom semester structures with downloadable summaries.",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "CGPA Buddy logo",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CGPA Buddy",
    description:
      "Calculate and track GPA/CGPA for RMSTU and custom semester structures.",
    images: ["/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
