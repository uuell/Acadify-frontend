import { useState } from "react";

import type { StudentGPA } from "../../types/student";

interface AcademicOverviewProps {
  gpa: StudentGPA;
}

type GpaMode = "weighted" | "simple";

function AcademicOverview({ gpa }: AcademicOverviewProps) {
  const [gpaMode, setGpaMode] = useState<GpaMode>("weighted");
  const semesterGPA =
    gpaMode === "weighted"
        ? gpa.semester_weighted
        : gpa.semester_simple;

    const cumulativeGPA = gpa.cumulative_weighted;

    function formatGPA(value: number | null): string {
    return value === null ? "—" : value.toFixed(2);
    }

  return (
    <section className="student-academic-overview">
      <div className="student-section-header">
        <div>
          <h2>Academic Overview</h2>
          <p>Your academic performance at a glance.</p>
        </div>

        <div className="student-gpa-toggle">
          <button
            type="button"
            className={gpaMode === "weighted" ? "active" : ""}
            onClick={() => setGpaMode("weighted")}
            aria-pressed={gpaMode === "weighted"}
          >
            Weighted
          </button>

          <button
            type="button"
            className={gpaMode === "simple" ? "active" : ""}
            onClick={() => setGpaMode("simple")}
            aria-pressed={gpaMode === "simple"}
          >
            Simple
          </button>
        </div>
      </div>

      <div className="student-overview-grid">
        <div className="student-overview-card">
          <span className="student-card-label">
            Semester GPA
          </span>

          <strong className="student-card-value">
            {formatGPA(semesterGPA)}
          </strong>

          <span className="student-card-description">
            {gpaMode === "weighted"
              ? "Weighted by subject units"
              : "Equal weight per subject"}
          </span>
        </div>

        <div className="student-overview-card">
          <span className="student-card-label">
            Cumulative GPA
          </span>

          <strong className="student-card-value">
            {formatGPA(cumulativeGPA)}
          </strong>

          <span className="student-card-description">
            Overall academic performance
          </span>
        </div>
      </div>
    </section>
  );
}

export default AcademicOverview;