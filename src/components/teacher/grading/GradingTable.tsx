
import type { TeacherGradingResponse } from "../../../types/teacherGrading";

import GradingTableHeader from "./GradingTableHeader";
import GradingTableRow from "./GradingTableRow";
import { sortTerms } from "./gradingUtils";

import "../GradingTable.css";

interface GradingTableProps {
  grading: TeacherGradingResponse["grading"];
  onScoreClick: (studentId: number, testId: number) => void;
  onDeleteTest: (testId: number) => void;
  deletingTestId: number | null;
}

export default function GradingTable({
  grading,
  onScoreClick,
  onDeleteTest,
  deletingTestId,
}: GradingTableProps) {
  const terms = sortTerms(grading.terms);

  return (
    <div className="grading-spreadsheet">
      <table className="grading-table">
        <GradingTableHeader
          tests={grading.tests}
          terms={terms}
          onDeleteTest={onDeleteTest}
          deletingTestId={deletingTestId}
        />

        <tbody>
          {grading.students.map((student) => (
            <GradingTableRow
              key={student.student.id}
              row={student}
              tests={grading.tests}
              terms={terms}
              onScoreClick={onScoreClick}
            />
          ))}
        </tbody>
      </table>

      {grading.students.length === 0 && (
        <div className="grading-table-empty">
          No enrolled students in this class.
        </div>
      )}
    </div>
  );
}
