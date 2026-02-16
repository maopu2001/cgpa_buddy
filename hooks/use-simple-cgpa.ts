import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "simple-cgpa-data";

export interface SemesterData {
  name: string;
  gpa: number | string;
  credits: number | string;
}

interface SimpleCGPAData {
  semesters: SemesterData[];
}

export function useSimpleCGPA() {
  const [semesters, setSemestersState] = useState<SemesterData[]>([]);
  const [mounted, setMounted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: SimpleCGPAData = JSON.parse(saved);
        setSemestersState(data.semesters || []);
      }
    } catch {
      // Ignore errors
    }
    setDataLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted && dataLoaded) {
      const data: SimpleCGPAData = {
        semesters,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [semesters, mounted, dataLoaded]);

  const setSemesters = useCallback((semesters: SemesterData[]) => {
    setSemestersState(semesters);
  }, []);

  const addSemester = useCallback((semester: SemesterData) => {
    setSemestersState((prev) => [...prev, semester]);
  }, []);

  const removeSemester = useCallback((name: string) => {
    setSemestersState((prev) => prev.filter((s) => s.name !== name));
  }, []);

  const updateSemester = useCallback(
    (name: string, field: "gpa" | "credits", value: string | number) => {
      setSemestersState((prev) =>
        prev.map((s) => (s.name === name ? { ...s, [field]: value } : s)),
      );
    },
    [],
  );

  const resetAll = useCallback(() => {
    setSemestersState([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    semesters,
    mounted,
    dataLoaded,
    setSemesters,
    addSemester,
    removeSemester,
    updateSemester,
    resetAll,
  };
}
