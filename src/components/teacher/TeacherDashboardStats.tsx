
import type { TeacherDashboardStatistics } from "../../types/teacher";

interface TeacherDashboardStatsProps {
  statistics: TeacherDashboardStatistics;
}

const weekDays = [
  { key: "Monday", label: "M" },
  { key: "Tuesday", label: "T" },
  { key: "Wednesday", label: "W" },
  { key: "Thursday", label: "T" },
  { key: "Friday", label: "F" },
  { key: "Saturday", label: "S" },
] as const;

function TeacherDashboardStats({
  statistics,
}: TeacherDashboardStatsProps) {
  return (
    <section className="teacher-stats-grid">
      {/* Total Enrolled Students */}
      <div className="teacher-stat-card">
        <div className="teacher-stat-header">
          <div className="teacher-stat-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <span className="teacher-stat-active">Active</span>
        </div>

        <div className="teacher-stat-value">
          {statistics.total_students}
        </div>

        <div className="teacher-stat-label">
          Total Enrolled Students
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="teacher-stat-card">
        <div className="teacher-stat-header">
          <div className="teacher-stat-icon">
            <svg viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <span className="teacher-stat-week-label">
            Week View
          </span>
        </div>

        <div className="teacher-week-view">
          {weekDays.map((day) => {
            const count =
              statistics.weekly_schedule[day.key];

            return (
              <div
                key={day.key}
                className={`teacher-day-box ${
                  count > 0 ? "active" : ""
                }`}
                title={`${day.key}: ${count} scheduled classes`}
              >
                <span className="teacher-day-label">
                  {day.label}
                </span>

                {count}
              </div>
            );
          })}
        </div>

        <div className="teacher-stat-label teacher-week-caption">
          Classes scheduled this week
        </div>
      </div>

      {/* Total Active Sections */}
      <div className="teacher-stat-card">
        <div className="teacher-stat-header">
          <div className="teacher-stat-icon">
            <svg viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div className="teacher-stat-value">
          {statistics.total_classes}
        </div>

        <div className="teacher-stat-label">
          Total Active Sections
        </div>
      </div>
    </section>
  );
}

export default TeacherDashboardStats;
