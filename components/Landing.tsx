"use client";
import { useRouter } from "next/navigation";
import { rmstu } from "@/data/rmstu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, ArrowRight, Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClearAllData } from "@/components/ClearAllData";
import Image from "next/image";
import Github from "./svg/github";
import Link from "next/link";

const Landing = () => {
  const router = useRouter();
  const departments = Object.entries(rmstu);

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/5 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-15 text-center sm:py-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <GraduationCap className="h-4 w-4" />
            RMSTU CGPA Buddy
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Calculate Your{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              CGPA
            </span>{" "}
            Instantly
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            A modern calculator for Rangamati Science and Technology University
            students. Select your department and start calculating your GPA &
            CGPA.
          </p>
        </div>
      </header>

      {/* Departments */}
      <section className="mx-auto max-w-5xl px-4 pb-20 mt-5">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          Select Your Department
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(([code, dept]) => {
            const available = dept.semesters.length > 0;
            return (
              <Card
                key={code}
                className={`group relative overflow-hidden transition-all ${
                  available
                    ? "cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40"
                    : "opacity-60"
                }`}
                onClick={() => available && router.push(`/rmstu/${code}`)}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div
                    className={`mt-0.5 rounded-xl p-2.5 ${available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {dept.dept}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {code}
                    </p>
                    {!available && (
                      <span className="mt-2 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  {available && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Custom CGPA Calculator */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          Custom CGPA Calculators
        </h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Detailed Calculator */}
          <Card
            className="group relative overflow-hidden transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40"
            onClick={() => router.push("/custom/new")}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-xl p-3 bg-primary/10 text-primary shrink-0">
                  <Calculator className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">
                    Detailed Calculator
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create custom semesters and add courses with grades. Get
                    detailed analysis of your performance.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Simple Calculator */}
          <Card
            className="group relative overflow-hidden transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40"
            onClick={() => router.push("/custom/simple")}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-xl p-3 bg-secondary/10 text-secondary shrink-0">
                  <Calculator className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">
                    Simple Calculator
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quick CGPA calculation. Just enter semester GPA and credits
                    to get your overall result.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clear All Data */}
      <section className="mx-auto max-w-5xl px-4 py-5 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground text-center">
          Need to start fresh? Clear all saved data from your browser.
        </p>
        <ClearAllData />
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center gap-6">
            {/* Creator Info */}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Created and Maintained by
              </p>
              <p className="text-lg font-semibold text-primary">
                M. Aktaruzzaman Opu
              </p>
              <p className="text-sm">
                Department of Computer Science and Engineering
              </p>
              <p className="text-sm font-semibold">
                Rangamati Science and Technology University
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="https://github.com/maopu2001"
                target="_blank"
                className="border rounded-sm gap-2 flex items-center px-3 py-2 text-sm hover:bg-accent transition-all"
              >
                <Github className="h-4 w-4 fill-foreground" />
                <span>GitHub Profile</span>
              </Link>
              <Link
                href="https://github.com/maopu2001"
                target="_blank"
                className="border rounded-sm gap-2 flex items-center px-3 py-2 text-sm hover:bg-accent transition-all"
              >
                <Github className="h-4 w-4 fill-foreground" />
                <span>View Repository</span>
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} RMSTU CGPA Buddy. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
