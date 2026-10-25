
import type { TeacherClass } from "../../types/teacherClasses";

interface TeacherClassCardProps {
  classItem: TeacherClass;
  onView: (classId: number) => void;
  onEdit: (classId: number) => void;
  onDelete: (classId: number) => void;
}

function TeacherClassCard({
  classItem,
  onView,
  onEdit,
  onDelete,
}: TeacherClassCardProps) {
  const {
    id,
    code,
    name,
    section,
    units,
    room,
    schedule,
    academic_period,
    enrollment,
    grading,
  } = classItem;

  const capacity = Math.min(
    100,
    Math.max(0, enrollment.capacity_percentage),
  );

  const completion = Math.min(
    100,
    Math.max(0, grading.completion_percentage),
  );

  return (
    <article className="teacher-class-card">
      <div className="teacher-class-card-top">
        <span className="teacher-class-code">{code}</span>
        <span className="teacher-class-section">
          Section {section}
        </span>
      </div>

      <h3 className="teacher-class-name">{name}</h3>

      <p className="teacher-class-details">
        {units} {units === 1 ? "Unit" : "Units"}
        {" · "}
        {room ? `Room ${room}` : "No room assigned"}
      </p>

      <p className="teacher-class-schedule">
        {schedule || "No schedule assigned"}
      </p>

      <p className="teacher-class-period">
        {academic_period.semester} · {academic_period.school_year}
      </p>

      <div className="teacher-class-metrics">
        <div className="teacher-class-metric">
          <div className="teacher-class-metric-heading">
            <span>Enrolled Students</span>
            <strong>
              {enrollment.count}/{enrollment.max_students}
            </strong>
          </div>

          <div
            className="teacher-class-progress-track"
            role="progressbar"
            aria-label="Enrollment capacity"
            aria-valuenow={capacity}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="teacher-class-progress-fill enrollment"
              style={{ width: `${capacity}%` }}
            />
          </div>
        </div>

        <div className="teacher-class-metric">
          <div className="teacher-class-metric-heading">
            <span>Grading Completion</span>
            <strong>
              {grading.completion_percentage.toFixed(1)}%
            </strong>
          </div>

          <div
            className="teacher-class-progress-track"
            role="progressbar"
            aria-label="Grading completion"
            aria-valuenow={completion}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="teacher-class-progress-fill grading"
              style={{ width: `${completion}%` }}
            />
          </div>

          <span className="teacher-class-grading-detail">
            {grading.graded_count} of{" "}
            {grading.total_possible_grades} grades recorded
          </span>
        </div>
      </div>

      <div className="teacher-class-actions">
        <button
          type="button"
          className="teacher-class-action view"
          onClick={() => onView(id)}
        >
          View
        </button>

        <button
          type="button"
          className="teacher-class-action edit"
          onClick={() => onEdit(id)}
        >
          Edit
        </button>

        <button
          type="button"
          className="teacher-class-action delete"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TeacherClassCard;
