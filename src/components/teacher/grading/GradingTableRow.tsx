import type {
  GradingStudent,
  GradingTest,
} from "./gradingUtils";

import {
  formatScore,
  getTestsByTerm,
} from "./gradingUtils";

interface GradingTableRowProps {
  row: GradingStudent;
  tests: GradingTest[];
  terms: string[];
  onScoreClick: (studentId: number, testId: number) => void;
}

export default function GradingTableRow({
  row,
  tests,
  terms,
  onScoreClick,
}: GradingTableRowProps) {
  const student = row.student;

  const fullName = `${student.first_name} ${student.last_name}`;

  const initials =
    `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`;

  return (
    <tr>
      {/* Student Name */}
      <td className="grading-sticky-name">
        <div className="grading-student-cell">
          <span className="grading-student-avatar">
            {initials}
          </span>
          <span>{fullName}</span>
        </div>
      </td>

      {/* Student ID */}
      <td className="grading-sticky-id">
        {student.student_number}
      </td>

      {/* Activity Scores and Term Grades */}
      {terms.length > 0
        ? terms.map((term) => (
            <TermScoreCells
              key={term}
              term={term}
              tests={getTestsByTerm(tests, term)}
              row={row}
              onScoreClick={onScoreClick}
            />
          ))
        : tests.map((test) => (
            <td key={test.id}>
              <button
                type="button"
                className="grading-cell-input grading-score-button"
                onClick={() => onScoreClick(student.id, test.id)}
              >
                {formatScore(row, test.id)}
              </button>
            </td>
          ))}

      {/* Overall Grade */}
      <td>
        <input
          className={`grading-cell-input grading-calculated ${
            row.enrollment.final_grade_display === "INC"
              ? "grading-incomplete"
              : ""
          }`}
          value={row.enrollment.final_grade_display || "—"}
          readOnly
        />
      </td>
    </tr>
  );
}

function TermScoreCells({
  term,
  tests,
  row,
  onScoreClick,
}: {
  term: string;
  tests: GradingTest[];
  row: GradingStudent;
  onScoreClick: (studentId: number, testId: number) => void;
}) {
  const termGrade = row.term_grades[term];
  const display = termGrade?.display || "—";

  return (
    <>
      {tests.map((test) => (
        <td key={test.id}>
          <button
            type="button"
            className="grading-cell-input grading-score-button"
            onClick={() => onScoreClick(row.student.id, test.id)}
            title={test.component_tag ?? ""}
          >
            {formatScore(row, test.id)}
          </button>
        </td>
      ))}

      <td className="grading-term-grade-cell">
        <input
          className={`grading-cell-input grading-calculated ${
            display === "INC" ? "grading-incomplete" : ""
          }`}
          value={display}
          readOnly
          title={
            termGrade?.missing_components?.length
              ? `Missing: ${termGrade.missing_components.join(", ")}`
              : `${term} Grade`
          }
        />
      </td>
    </>
  );
}