import type { StudentClassesStats } from "../../types/student";

interface ClassesStatsProps {
  stats: StudentClassesStats;
}

function ClassesStats({ stats }: ClassesStatsProps) {
  return (
    <section className="student-classes-stats">
      <div className="student-classes-stat-card">
        <div className="student-classes-stat-icon">📚</div>

        <div>
          <p>Total Subjects</p>
          <h3>{stats.total_subjects}</h3>
        </div>
      </div>

      <div className="student-classes-stat-card">
        <div className="student-classes-stat-icon">🎓</div>

        <div>
          <p>Total Units</p>
          <h3>{stats.total_units}</h3>
        </div>
      </div>

      <div className="student-classes-stat-card">
        <div className="student-classes-stat-icon">📊</div>

        <div>
          <p>Graded Subjects</p>
          <h3>{stats.graded_count}</h3>
        </div>
      </div>
    </section>
  );
}

export default ClassesStats;