import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "CGPA Calculator",
  description: "Rangamati Science & Technology University CGPA calculator",
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
