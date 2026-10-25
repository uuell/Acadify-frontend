import { useState } from "react";

import type {
  StudentGradeTest,
  StudentTestScore,
} from "../../types/student";

interface AssessmentBreakdownProps {
  tests: StudentGradeTest[];
  testGrades: Record<string, StudentTestScore>;
}

const TERMS = ["Prelims", "Midterms", "Finals"] as const;

type Term = (typeof TERMS)[number];

function AssessmentBreakdown({
  tests,
  testGrades,
}: AssessmentBreakdownProps) {
  const [selectedTerm, setSelectedTerm] =
    useState<Term>("Prelims");

  const filteredTests = tests.filter(
    (test) => test.term_tag === selectedTerm
  );

  return (
    <section className="student-assessment-breakdown">
      <h3>Assessment Breakdown</h3>

      <div className="student-assessment-tabs">
        {TERMS.map((term) => (
          <button
            key={term}
            type="button"
            className={
              selectedTerm === term
                ? "student-assessment-tab active"
                : "student-assessment-tab"
            }
            onClick={() => setSelectedTerm(term)}
          >
            {term}
          </button>
        ))}
      </div>

      {filteredTests.length === 0 ? (
        <p className="student-assessment-empty">
          No assessments found for {selectedTerm}.
        </p>
      ) : (
        <div className="student-assessment-table-wrapper">
          <table className="student-assessment-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Component</th>
                <th>Score</th>
                <th>Percentage</th>
              </tr>
            </thead>

            <tbody>
              {filteredTests.map((test) => {
                const score = testGrades[String(test.id)];

                return (
                  <tr key={test.id}>
                    <td>{test.title}</td>
                    <td>{test.component_tag}</td>

                    <td>
                      {score
                        ? `${score.raw_score} / ${score.max_score}`
                        : "—"}
                    </td>

                    <td>
                      {score?.calculated_percentage != null
                        ? `${score.calculated_percentage.toFixed(2)}%`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AssessmentBreakdown;