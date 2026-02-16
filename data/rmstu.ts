export interface Subject {
  name: string;
  code: string;
  credit: number;
  type: "theory" | "lab" | "special";
}

export interface Semester {
  year: string;
  semester: string;
  code: string;
  subjects: Subject[];
}

export interface Electives {
  option_I: Subject[];
  option_II: Subject[];
}

export interface Department {
  dept: string;
  deptCode: string;
  university: string;
  semesters: Semester[];
  electives?: Electives;
}

export const GRADE_SCALE: { label: string; value: number }[] = [
  { label: "A+ (4.00)", value: 4.0 },
  { label: "A (3.75)", value: 3.75 },
  { label: "A- (3.50)", value: 3.5 },
  { label: "B+ (3.25)", value: 3.25 },
  { label: "B (3.00)", value: 3.0 },
  { label: "B- (2.75)", value: 2.75 },
  { label: "C+ (2.50)", value: 2.5 },
  { label: "C (2.25)", value: 2.25 },
  { label: "D (2.00)", value: 2.0 },
  { label: "F (0.00)", value: 0.0 },
];

export const rmstu: Record<string, Department> = {
  CSE: {
    dept: "Computer Science and Engineering",
    deptCode: "CSE",
    university: "Rangamati Science and Technology University",
    semesters: [
      {
        year: "1st Year",
        semester: "1st Semester",
        code: "11",
        subjects: [
          {
            name: "Computer Fundamentals Lab",
            code: "CSE-1101",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Structured Programming Language",
            code: "CSE-1102",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Structured Programming Language Lab",
            code: "CSE-1103",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Basic Electrical Engineering",
            code: "EEE-1104",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Basic Electrical Engineering Lab",
            code: "EEE-1105",
            credit: 1.5,
            type: "lab",
          },
          { name: "Calculus", code: "Math-1106", credit: 3.0, type: "theory" },
          { name: "Physics", code: "Phy-1107", credit: 3.0, type: "theory" },
          { name: "Physics Lab", code: "Phy-1108", credit: 1.5, type: "lab" },
          { name: "English", code: "Eng-1109", credit: 2.0, type: "theory" },
        ],
      },
      {
        year: "1st Year",
        semester: "2nd Semester",
        code: "12",
        subjects: [
          {
            name: "Discrete Mathematics",
            code: "CSE-1201",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Object Oriented Programming Language",
            code: "CSE-1202",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Object Oriented Programming Language Lab",
            code: "CSE-1203",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Digital Logic Design",
            code: "CSE-1204",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Digital Logic Design Lab",
            code: "CSE-1205",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Matrices, Differential Equation and Geometry",
            code: "Math-1206",
            credit: 4.0,
            type: "theory",
          },
          { name: "Chemistry", code: "Chem-1207", credit: 3.0, type: "theory" },
          {
            name: "English Skill Development Lab",
            code: "Eng-1208",
            credit: 1.5,
            type: "lab",
          },
        ],
      },
      {
        year: "2nd Year",
        semester: "1st Semester",
        code: "21",
        subjects: [
          {
            name: "Data Structures",
            code: "CSE-2101",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Data Structures Lab",
            code: "CSE-2102",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Numerical Analysis",
            code: "Math-2103",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Numerical Analysis Lab",
            code: "Math-2104",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Engineering Drawing Lab",
            code: "EEE-2105",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Basic Electronic Devices and Circuits",
            code: "EEE-2106",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Basic Electronic Devices and Circuits Lab",
            code: "EEE-2107",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Vector Calculus, Linear Algebra and Complex Variable",
            code: "Math-2108",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Engineering Economics",
            code: "Eco-2109",
            credit: 3.0,
            type: "theory",
          },
        ],
      },
      {
        year: "2nd Year",
        semester: "2nd Semester",
        code: "22",
        subjects: [
          {
            name: "Database Management Systems",
            code: "CSE-2201",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Database Management Systems Lab",
            code: "CSE-2202",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Computer Architecture and Organization",
            code: "CSE-2203",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Design and Analysis of Algorithms",
            code: "CSE-2204",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Design and Analysis of Algorithms Lab",
            code: "CSE-2205",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Microprocessors and Assembly Language",
            code: "CSE-2206",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Microprocessors and Assembly Language Lab",
            code: "CSE-2207",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Software Development with Java Lab",
            code: "CSE-2208",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Probability and Statistical Analysis",
            code: "Stat-2209",
            credit: 3.0,
            type: "theory",
          },
        ],
      },
      {
        year: "3rd Year",
        semester: "1st Semester",
        code: "31",
        subjects: [
          {
            name: "Computer Peripheral Device and Interfacing",
            code: "CSE-3101",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Computer Peripheral Device and Interfacing Lab",
            code: "CSE-3102",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Operating Systems",
            code: "CSE-3103",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Operating Systems Lab",
            code: "CSE-3104",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Theory of Computation",
            code: "CSE-3105",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Web Engineering Lab",
            code: "CSE-3106",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Compiler Designing",
            code: "CSE-3107",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Compiler Designing Lab",
            code: "CSE-3108",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Sociology, Ethics and Legal Aspects of Information",
            code: "Sco-3109",
            credit: 3.0,
            type: "theory",
          },
        ],
      },
      {
        year: "3rd Year",
        semester: "2nd Semester",
        code: "32",
        subjects: [
          {
            name: "Data Communication",
            code: "CSE-3201",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Data Communication Lab",
            code: "CSE-3202",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Software Engineering",
            code: "CSE-3203",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Software Engineering Lab",
            code: "CSE-3204",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Artificial Intelligence",
            code: "CSE-3205",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Artificial Intelligence Lab",
            code: "CSE-3206",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "System Analysis and Design",
            code: "CSE-3207",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "System Analysis and Design Lab",
            code: "CSE-3208",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Scientific Report Writing Lab",
            code: "LGE-3209",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Bangladesh Studies",
            code: "Gen-3210",
            credit: 3.0,
            type: "theory",
          },
        ],
      },
      {
        year: "4th Year",
        semester: "1st Semester",
        code: "41",
        subjects: [
          {
            name: "Project/Thesis",
            code: "CSE-4101",
            credit: 1.0,
            type: "special",
          },
          {
            name: "Computer Networking",
            code: "CSE-4102",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Computer Networking Lab",
            code: "CSE-4103",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Computer Graphics",
            code: "CSE-4104",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Computer Graphics Lab",
            code: "CSE-4105",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Financial, Cost and Managerial Accounting",
            code: "Mgt-4106",
            credit: 2.0,
            type: "theory",
          },
          {
            name: "Industrial Attachment",
            code: "CSE-4107",
            credit: 2.0,
            type: "special",
          },
          {
            name: "Option-I/Option-II",
            code: "ELECTIVE-1",
            credit: 3.0,
            type: "theory",
          },
        ],
      },
      {
        year: "4th Year",
        semester: "2nd Semester",
        code: "42",
        subjects: [
          {
            name: "Project/Thesis",
            code: "CSE-4201",
            credit: 3.0,
            type: "special",
          },
          {
            name: "Engineering Management",
            code: "CSE-4202",
            credit: 2.0,
            type: "theory",
          },
          {
            name: "Digital Systems Design",
            code: "CSE-4203",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Digital Systems Design Lab",
            code: "CSE-4204",
            credit: 1.5,
            type: "lab",
          },
          {
            name: "Information Security",
            code: "CSE-4205",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Option-I/Option-II (Theory)",
            code: "ELECTIVE-2",
            credit: 3.0,
            type: "theory",
          },
          {
            name: "Option-I/Option-II (Lab)",
            code: "ELECTIVE-2-LAB",
            credit: 1.5,
            type: "lab",
          },
        ],
      },
    ],
    electives: {
      option_I: [
        {
          name: "Optical Fiber Communications",
          code: "CSE-5101",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Soft Computing",
          code: "CSE-5102",
          credit: 3.0,
          type: "theory",
        },
        { name: "E-Commerce", code: "CSE-5103", credit: 3.0, type: "theory" },
        { name: "Robotics", code: "CSE-5104", credit: 3.0, type: "theory" },
        {
          name: "Natural Language Processing",
          code: "CSE-5105",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Computer Vision",
          code: "CSE-5106",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Object Oriented Analysis and Design",
          code: "CSE-5107",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Bio-Informatics",
          code: "CSE-5108",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Data Warehouse Systems",
          code: "CSE-5109",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Management Information Systems",
          code: "CSE-5110",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Special Topics related to CSE",
          code: "CSE-5111",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Lab of Selected Topic / Lab of Special Topics related to CSE",
          code: "CSE-5112",
          credit: 1.5,
          type: "lab",
        },
      ],
      option_II: [
        {
          name: "Mobile Computing",
          code: "CSE-5201",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Geographical Information Systems",
          code: "CSE-5202",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Parallel Computing",
          code: "CSE-5203",
          credit: 3.0,
          type: "theory",
        },
        { name: "VLSI Design", code: "CSE-5204", credit: 3.0, type: "theory" },
        {
          name: "Human Computer Interaction",
          code: "CSE-5205",
          credit: 3.0,
          type: "theory",
        },
        { name: "Graph Theory", code: "CSE-5206", credit: 3.0, type: "theory" },
        {
          name: "Multimedia Systems",
          code: "CSE-5207",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Digital Signal Processing",
          code: "CSE-5208",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Digital Image Processing",
          code: "CSE-5209",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Special Topics related to CSE",
          code: "CSE-5210",
          credit: 3.0,
          type: "theory",
        },
        {
          name: "Lab of Selected Topic / Lab of Special Topics /related to CSE",
          code: "CSE-5211",
          credit: 1.5,
          type: "lab",
        },
      ],
    },
  },
  MGT: {
    dept: "Management",
    deptCode: "MGT",
    university: "Rangamati Science and Technology University",
    semesters: [],
  },
  FES: {
    dept: "Forestry and Environmental Science",
    deptCode: "FES",
    university: "Rangamati Science and Technology University",
    semesters: [],
  },
  FMRT: {
    dept: "Fisheries and Marine Resource Technology",
    deptCode: "FMRT",
    university: "Rangamati Science and Technology University",
    semesters: [],
  },
  THM: {
    dept: "Tourism and Hospitality Management",
    deptCode: "THM",
    university: "Rangamati Science and Technology University",
    semesters: [],
  },
};

export const getCSEElectiveOptions = (code: string, deptCode: string) => {
  if (!rmstu[deptCode]) return [];
  const electives = rmstu[deptCode].electives;

  if (!electives) return [];
  if (code === "ELECTIVE-1")
    return electives.option_I.filter((e) => e.type !== "lab");
  if (code === "ELECTIVE-2")
    return electives.option_II.filter((e) => e.type !== "lab");
  if (code === "ELECTIVE-2-LAB") {
    return electives.option_II.filter((e) => e.type === "lab");
  }

  return [...electives.option_I, ...electives.option_II];
};
