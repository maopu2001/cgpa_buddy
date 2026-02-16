import { useState, useEffect, useCallback } from "react";
import type { GradeMap } from "@/lib/cgpa";

export type ElectiveSelection = Record<string, string>; // elective code -> chosen subject code
export type ManualGPAs = Record<string, number>; // semester code -> manual GPA
export type FixGPAMap = Record<string, boolean>; // semester code -> fixGPA state

interface RMSTUData {
  grades: GradeMap;
  electives: ElectiveSelection;
  manualGPAs: ManualGPAs;
  fixGPAMap: FixGPAMap;
}

export function useGrades(deptCode: string) {
  const STORAGE_KEY = `rmstu-${deptCode.toLowerCase()}-cgpa-data`;

  const [grades, setGrades] = useState<GradeMap>({});
  const [electives, setElectives] = useState<ElectiveSelection>({});
  const [manualGPAs, setManualGPAs] = useState<ManualGPAs>({});
  const [fixGPAMap, setFixGPAMap] = useState<FixGPAMap>({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load data when STORAGE_KEY (department) changes
  useEffect(() => {
    if (!mounted) return;

    // Reset state when department changes
    setGrades({});
    setElectives({});
    setManualGPAs({});
    setFixGPAMap({});

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: RMSTUData = JSON.parse(saved);
        setGrades(data.grades || {});
        setElectives(data.electives || {});
        setManualGPAs(data.manualGPAs || {});
        setFixGPAMap(data.fixGPAMap || {});
      }
    } catch {
      // Ignore errors
    }
  }, [STORAGE_KEY, mounted]);

  // Save all data to a single localStorage key
  useEffect(() => {
    if (mounted) {
      const data: RMSTUData = {
        grades,
        electives,
        manualGPAs,
        fixGPAMap,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [grades, electives, manualGPAs, fixGPAMap, mounted, STORAGE_KEY]);

  const setGrade = useCallback((code: string, value: number | null) => {
    setGrades((prev) => ({ ...prev, [code]: value }));
  }, []);

  const setElective = useCallback(
    (electiveCode: string, subjectCode: string) => {
      setElectives((prev) => ({ ...prev, [electiveCode]: subjectCode }));
    },
    [],
  );

  const setManualGPA = useCallback((semesterCode: string, gpa: number) => {
    setManualGPAs((prev) => ({ ...prev, [semesterCode]: gpa }));
  }, []);

  const setFixGPA = useCallback((semesterCode: string, fix: boolean) => {
    setFixGPAMap((prev) => ({ ...prev, [semesterCode]: fix }));
  }, []);

  const resetAll = useCallback(() => {
    setGrades({});
    setElectives({});
    setManualGPAs({});
    setFixGPAMap({});
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);

  return {
    grades,
    electives,
    manualGPAs,
    fixGPAMap,
    setGrade,
    setElective,
    setManualGPA,
    setFixGPA,
    resetAll,
  };
}
