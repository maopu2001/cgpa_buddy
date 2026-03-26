import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CGPA Buddy",
    short_name: "CGPA Buddy",
    description:
      "A web-based GPA/CGPA calculator designed for Rangamati Science and Technology University (RMSTU) students and other educational institutions with custom semester structures",
    start_url: "/",
    display: "standalone",
    theme_color: "#111827",
    lang: "en",
    icons: [
      {
        src: "/logo.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/logo.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
