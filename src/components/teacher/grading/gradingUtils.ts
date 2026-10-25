import type { TeacherGradingResponse } from "../../../types/teacherGrading";

export type GradingData = TeacherGradingResponse["grading"];

export type GradingTest = GradingData["tests"][number];

export type GradingStudent = GradingData["students"][number];

const TERM_ORDER: Record<string, number> = {
  Prelims: 0,
  Midterms: 1,
  Finals: 2,
};

export function sortTerms(terms: string[]): string[] {
  return [...terms].sort(
    (a, b) => (TERM_ORDER[a] ?? 99) - (TERM_ORDER[b] ?? 99),
  );
}

export function getTestsByTerm(
  tests: GradingTest[],
  term: string,
): GradingTest[] {
  return tests.filter((test) => test.term_tag === term);
}

export function formatScore(
  student: GradingStudent,
  testId: number,
): string {
  const grade = student.test_grades[String(testId)];

  if (
    !grade ||
    grade.raw_score === null ||
    grade.max_score === null
  ) {
    return "-";
  }

  return `${grade.raw_score}/${grade.max_score}`;
}