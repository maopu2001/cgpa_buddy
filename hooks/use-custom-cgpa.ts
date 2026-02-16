import { useState, useEffect, useCallback } from "react";
import type { GradeMap, ManualGPAs, FixGPAMap } from "@/lib/cgpa";

const STORAGE_KEY = "custom-cgpa-data";

export interface Course {
  name: string;
  code: string;
  credit: number;
  type: "theory" | "lab" | "special";
}

export interface Semester {
  year: string;
  semester: string;
  code: string;
  courses: Course[];
}

export interface CustomStructure {
  semesters: Semester[];
}

interface CustomCGPAData {
  structure?: CustomStructure;
  grades?: GradeMap;
  manualGPAs?: ManualGPAs;
  fixGPAMap?: FixGPAMap;
}

export function useCustomCGPA() {
  const [structure, setStructureState] = useState<CustomStructure | null>(null);
  const [grades, setGradesState] = useState<GradeMap>({});
  const [manualGPAs, setManualGPAsState] = useState<ManualGPAs>({});
  const [fixGPAMap, setFixGPAMapState] = useState<FixGPAMap>({});
  const [mounted, setMounted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: CustomCGPAData = JSON.parse(saved);
        setStructureState(data.structure || null);
        setGradesState(data.grades || {});
        setManualGPAsState(data.manualGPAs || {});
        setFixGPAMapState(data.fixGPAMap || {});
      }
    } catch {
      // Ignore errors
    }
    setDataLoaded(true);
  }, []);

  // Save all data to localStorage
  useEffect(() => {
    if (mounted && dataLoaded) {
      const data: CustomCGPAData = {
        structure: structure || undefined,
        grades,
        manualGPAs,
        fixGPAMap,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [structure, grades, manualGPAs, fixGPAMap, mounted, dataLoaded]);

  const setStructure = useCallback((newStructure: CustomStructure) => {
    setStructureState(newStructure);
  }, []);

  const setGrade = useCallback((code: string, value: number | null) => {
    setGradesState((prev) => ({ ...prev, [code]: value }));
  }, []);

  const setManualGPA = useCallback((semesterCode: string, gpa: number) => {
    setManualGPAsState((prev) => ({ ...prev, [semesterCode]: gpa }));
  }, []);

  const setFixGPA = useCallback((semesterCode: string, fix: boolean) => {
    setFixGPAMapState((prev) => ({ ...prev, [semesterCode]: fix }));
  }, []);

  const resetGrades = useCallback(() => {
    setGradesState({});
    setManualGPAsState({});
    setFixGPAMapState({});
  }, []);

  const resetAll = useCallback(() => {
    setStructureState(null);
    setGradesState({});
    setManualGPAsState({});
    setFixGPAMapState({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    structure,
    grades,
    manualGPAs,
    fixGPAMap,
    mounted,
    dataLoaded,
    setStructure,
    setGrade,
    setManualGPA,
    setFixGPA,
    resetGrades,
    resetAll,
  };
}
