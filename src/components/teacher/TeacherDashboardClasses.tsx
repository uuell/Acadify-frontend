
import { Link } from "react-router-dom";
import type { TeacherDashboardClass } from "../../types/teacher";

interface TeacherDashboardClassesProps {
  classes: TeacherDashboardClass[];
}

function TeacherDashboardClasses({
  classes,
}: TeacherDashboardClassesProps) {
  return (
    <section className="teacher-dashboard-section">
      <div className="teacher-dashboard-section-title">
        <h2>Active Classes</h2>

        <Link
          to="/teacher/classes"
          className="teacher-dashboard-section-link"
        >
          Manage Roster
        </Link>
      </div>

      {classes.length > 0 ? (
        <div className="teacher-course-grid">
          {classes.map((classItem) => (
            <Link
              key={classItem.id}
              to={`/teacher/classes/${classItem.id}`}
              className="teacher-course-card"
            >
              <div>
                <div className="teacher-course-code">
                  {classItem.subject_code} • Section{" "}
                  {classItem.section || "N/A"}
                </div>

                <div className="teacher-course-name">
                  {classItem.subject_name}
                </div>
              </div>

              <div className="teacher-course-meta">
                <span>
                  {classItem.student_count}{" "}
                  {classItem.student_count === 1
                    ? "Student"
                    : "Students"}
                </span>

                {classItem.ungraded_count > 0 ? (
                  <span className="teacher-course-ungraded">
                    {classItem.ungraded_count} Ungraded
                  </span>
                ) : (
                  <span className="teacher-course-graded">
                    All Graded
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="teacher-dashboard-empty">
          <svg viewBox="0 0 24 24">
            <path
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>

          <h3>No classes yet</h3>
          <p>Start by creating your first class</p>

          <Link
            to="/teacher/classes"
            className="teacher-dashboard-section-link"
          >
            + Create Class
          </Link>
        </div>
      )}
    </section>
  );
}

export default TeacherDashboardClasses;
