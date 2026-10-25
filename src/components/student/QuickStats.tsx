import type {
  StudentStats,
  AcademicStanding,
} from "../../types/student";

interface QuickStatsProps {
  stats: StudentStats;
  academicStanding: AcademicStanding;
}


function QuickStats({
    stats,
    academicStanding,
    }: QuickStatsProps) {
        
  return (
    <section className="student-quick-stats">
      <div className="student-section-header">
        <div>
          <h2>Quick Statistics</h2>
          <p>Your current academic summary.</p>
        </div>
      </div>

      <div className="student-stats-grid">
        <div className="student-stat-card">
          <div className="student-stat-icon">
            <span>📚</span>
          </div>

          <div className="student-stat-info">
            <span className="student-stat-label">
              Total Units
            </span>

            <strong className="student-stat-value">
              {stats.total_units}
            </strong>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-icon">
            <span>📊</span>
          </div>

          <div className="student-stat-info">
            <span className="student-stat-label">
              Graded Subjects
            </span>

            <strong className="student-stat-value">
              {stats.graded_count} / {stats.total_count}
            </strong>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-icon">
            <span>🎓</span>
          </div>

          <div className="student-stat-info">
            <span className="student-stat-label">
              Academic Standing
            </span>

            <strong className="student-stat-value">
              {academicStanding.standing}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuickStats;