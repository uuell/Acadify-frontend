import type {
  StudentProfileGPA,
  StudentProfileStats as StudentProfileStatsType,
} from "../../types/student";

interface StudentProfileStatsProps {
  gpa: StudentProfileGPA;
  stats: StudentProfileStatsType;
}

function StudentProfileStats({
  gpa,
  stats,
}: StudentProfileStatsProps) {
  return (
    <section className="student-profile-stats">
      <h2>Academic Overview</h2>

      <div className="student-profile-stats-grid">
        <div className="student-profile-stat-card">
          <p>Cumulative GPA</p>

          <strong>
            {gpa.cumulative_weighted != null
              ? gpa.cumulative_weighted.toFixed(2)
              : "—"}
          </strong>

          <span>Weighted GPA</span>
        </div>

        <div className="student-profile-stat-card">
          <p>Completed Units</p>

          <strong>{stats.total_completed_units}</strong>

          <span>Passed units</span>
        </div>

        <div className="student-profile-stat-card">
          <p>Current Classes</p>

          <strong>{stats.current_enrollments}</strong>

          <span>Active enrollments</span>
        </div>
      </div>
    </section>
  );
}

export default StudentProfileStats;