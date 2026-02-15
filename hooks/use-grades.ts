import { useState, useEffect, useCallback } from "react";
import type { GradeMap } from "@/lib/cgpa";

const STORAGE_KEY = "rmstu-cgpa-grades";
const ELECTIVE_KEY = "rmstu-cgpa-electives";

export type ElectiveSelection = Record<string, string>; // elective code -> chosen subject code

export function useGrades() {
  const [grades, setGrades] = useState<GradeMap>({});
  const [electives, setElectives] = useState<ElectiveSelection>({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const savedGrades = localStorage.getItem(STORAGE_KEY);
      const savedElectives = localStorage.getItem(ELECTIVE_KEY);
      if (savedGrades) setGrades(JSON.parse(savedGrades));
      if (savedElectives) setElectives(JSON.parse(savedElectives));
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

  const setGrade = useCallback((code: string, value: number | null) => {
    setGrades((prev) => ({ ...prev, [code]: value }));
  }, []);

  const setElective = useCallback(
    (electiveCode: string, subjectCode: string) => {
      setElectives((prev) => ({ ...prev, [electiveCode]: subjectCode }));
    },
    [],
  );

  const resetAll = useCallback(() => {
    setGrades({});
    setElectives({});
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ELECTIVE_KEY);
  }, []);

  return { grades, electives, setGrade, setElective, resetAll };
}
