import { useState, useEffect, useCallback } from "react";
import type { GradeMap } from "@/lib/cgpa";

const STORAGE_KEY = "rmstu-cgpa-grades";
const ELECTIVE_KEY = "rmstu-cgpa-electives";
const MANUAL_GPA_KEY = "rmstu-cgpa-manual-gpas";
const FIX_GPA_KEY = "rmstu-cgpa-fix-gpa";

export type ElectiveSelection = Record<string, string>; // elective code -> chosen subject code
export type ManualGPAs = Record<string, number>; // semester code -> manual GPA
export type FixGPAMap = Record<string, boolean>; // semester code -> fixGPA state

export function useGrades() {
  const [grades, setGrades] = useState<GradeMap>({});
  const [electives, setElectives] = useState<ElectiveSelection>({});
  const [manualGPAs, setManualGPAs] = useState<ManualGPAs>({});
  const [fixGPAMap, setFixGPAMap] = useState<FixGPAMap>({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const savedGrades = localStorage.getItem(STORAGE_KEY);
      const savedElectives = localStorage.getItem(ELECTIVE_KEY);
      const savedManualGPAs = localStorage.getItem(MANUAL_GPA_KEY);
      const savedFixGPAMap = localStorage.getItem(FIX_GPA_KEY);
      if (savedGrades) setGrades(JSON.parse(savedGrades));
      if (savedElectives) setElectives(JSON.parse(savedElectives));
      if (savedManualGPAs) setManualGPAs(JSON.parse(savedManualGPAs));
      if (savedFixGPAMap) setFixGPAMap(JSON.parse(savedFixGPAMap));
    } catch {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
    }
  }, [grades, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(ELECTIVE_KEY, JSON.stringify(electives));
    }
  }, [electives, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(MANUAL_GPA_KEY, JSON.stringify(manualGPAs));
    }
  }, [manualGPAs, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(FIX_GPA_KEY, JSON.stringify(fixGPAMap));
    }
  }, [fixGPAMap, mounted]);

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
    localStorage.removeItem(ELECTIVE_KEY);
    localStorage.removeItem(MANUAL_GPA_KEY);
    localStorage.removeItem(FIX_GPA_KEY);
  }, []);

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
