# CGPA Buddy

CGPA Buddy is a Next.js web app for calculating GPA/CGPA with three workflows:

- RMSTU department-based calculator (predefined semester + course structures)
- Custom detailed calculator (user-defined semesters and courses)
- Simple calculator (semester GPA + credits input only)

The app stores progress in localStorage, provides semester analytics, and exports transcript-style PDF summaries via a server API.

## Features

- Department-wise RMSTU calculator with grade, elective, and manual GPA support
- Custom structure builder for semesters/courses (theory/lab/special)
- Simple CGPA mode for quick cumulative calculation
- Interactive dashboard with GPA/CGPA insights and charts
- Data export/import for all calculator modes
- PDF export for all modes through `POST /api/pdf`
- Light/dark theme support
- SEO setup with metadata, robots, sitemap, and manifest routes

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Radix UI primitives + utility components
- Recharts (visualizations)
- Sonner (toast notifications)
- Zod (PDF payload validation)
- @react-pdf/renderer (PDF generation)

## Project Routes

- `/` - landing page
- `/rmstu/[dept]` - RMSTU department calculator
- `/custom/new` - custom calculator setup
- `/custom` - custom detailed calculator
- `/custom/simple` - simple CGPA calculator
- `/api/pdf` - PDF generation API (POST)
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Create `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

This value is used by metadata, `robots.ts`, and `sitemap.ts`.

### 3. Run development server

```bash
pnpm dev
```

Open http://localhost:3000.

## Scripts

- `pnpm dev` - run local development server
- `pnpm build` - build production app
- `pnpm start` - run production server
- `pnpm lint` - run ESLint
- `pnpm format` - run Prettier on the repository

## PDF API

Endpoint: `POST /api/pdf`

The API accepts one of three payload shapes. Validation is handled with Zod.

### 1) RMSTU (builtin) payload

```json
{
  "deptCode": "CSE",
  "grades": {
    "CSE1101": 3.75,
    "MAT1101": 4
  },
  "electives": {
    "ELEC-A": "CSE4105"
  },
  "manualGPAs": {
    "11": 3.5
  },
  "fixGPAMap": {
    "11": true
  }
}
```

### 2) Custom detailed payload

```json
{
  "structure": {
    "semesters": [
      {
        "year": "1st Year",
        "semester": "1st Semester",
        "code": "11",
        "courses": [
          {
            "name": "Programming Fundamentals",
            "code": "CSE1101",
            "credit": 3,
            "type": "theory"
          }
        ]
      }
    ]
  },
  "grades": {
    "CSE1101": 3.75
  },
  "manualGPAs": {
    "11": 3.8
  },
  "fixGPAMap": {
    "11": false
  }
}
```

### 3) Simple payload

```json
{
  "semesters": [
    {
      "name": "1st Year 1st Semester",
      "gpa": 3.75,
      "credits": 20
    },
    {
      "name": "1st Year 2nd Semester",
      "gpa": 3.6,
      "credits": 19
    }
  ]
}
```

Success response: PDF binary stream (`Content-Type: application/pdf`).

## Local Storage Keys

- RMSTU mode: `rmstu-${dept}-cgpa-data`
- Custom mode: `custom-cgpa-data`
- Simple mode: `simple-cgpa-data`

## GPA/CGPA Rules

- Subject grades use a 0.00 to 4.00 scale.
- Semester GPA is calculated from weighted grade points:

$$
GPA = \frac{\sum (grade \times credit)}{\sum credit}
$$

- CGPA is the weighted aggregate across semesters.
- In RMSTU/custom modes, a semester can be marked as fixed/manual GPA.
- Manual GPA values <= 0 are ignored in cumulative calculations.

## Deployment Notes

- Set `NEXT_PUBLIC_SITE_URL` to your public domain in production.
- Build with `pnpm build` and run with `pnpm start`.
- App metadata and SEO routes are generated from Next.js metadata APIs.

## Acknowledgement

Created and maintained by M. Aktaruzzaman Opu.
