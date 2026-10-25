export interface ProjectedSubject {
  subject_code: string;
  subject_name: string;
  units: number;
  grade: number | null;
  is_major_subject: boolean;
}

export type GPACalculationMethod =
  | "weighted"
  | "simple"
  | "major_only";

export function calculateProjectedGPA(
  subjects: ProjectedSubject[],
  method: GPACalculationMethod = "weighted"
): number | null {
  // Only include subjects with valid grades.
  const graded = subjects.filter(
    (subject) =>
      subject.grade !== null &&
      Number.isFinite(subject.grade) &&
      subject.units >= 0
  );

  if (graded.length === 0) {
    return null;
  }

  let result: number;

  switch (method) {
    case "weighted": {
      const totalPoints = graded.reduce(
        (sum, subject) => sum + subject.grade! * subject.units,
        0
      );

      const totalUnits = graded.reduce(
        (sum, subject) => sum + subject.units,
        0
      );

      if (totalUnits <= 0) {
        return null;
      }

      result = totalPoints / totalUnits;
      break;
    }

    case "simple": {
      const totalGrades = graded.reduce(
        (sum, subject) => sum + subject.grade!,
        0
      );

      result = totalGrades / graded.length;
      break;
    }

    case "major_only": {
      const majorSubjects = graded.filter(
        (subject) => subject.is_major_subject
      );

      if (majorSubjects.length === 0) {
        return null;
      }

      const totalMajorGrades = majorSubjects.reduce(
        (sum, subject) => sum + subject.grade!,
        0
      );

      result = totalMajorGrades / majorSubjects.length;
      break;
    }
  }

  // Match Flask's two-decimal GPA rounding for ordinary values.
  return Math.round((result + Number.EPSILON) * 100) / 100;
}