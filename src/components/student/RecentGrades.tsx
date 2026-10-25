import type { StudentRecentGrade } from "../../types/student";

interface RecentGradesProps {
  grades: StudentRecentGrade[];
}

function RecentGrades({ grades }: RecentGradesProps) {
  return (
    <section className="student-recent-grades">
      <div className="student-section-header">
        <div>
          <h2>Recent Grades</h2>
          <p>Your latest academic results.</p>
        </div>
      </div>

      <div className="student-recent-grades-list">
        <div className="student-recent-grades-list">
            {grades.length === 0 ? (
                <p className="student-empty-state">
                No recent grades available.
                </p>
            ) : (
                grades.map((grade) => (
                <div
                    className="student-recent-grade-item"
                    key={grade.id}
                >
                    <div className="student-recent-grade-info">
                    <strong>Test #{grade.test_id}</strong>

                    <span>
                        {grade.graded_at
                        ? new Date(grade.graded_at).toLocaleDateString()
                        : "Date unavailable"}
                    </span>
                    </div>

                    <div className="student-recent-grade-result">
                    <strong>
                        {grade.raw_score} / {grade.max_score}
                    </strong>

                    <span className="student-grade-badge">
                        {grade.calculated_percentage != null
                        ? `${grade.calculated_percentage.toFixed(2)}%`
                        : "—"}
                    </span>
                    </div>
                </div>
                ))
            )}
            </div>
      </div>
    </section>
  );
}

export default RecentGrades;