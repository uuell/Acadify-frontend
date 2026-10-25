import type {
  StudentClass,
  StudentEnrollment,
} from "../../types/student";

interface ClassesTableProps {
  classes: StudentClass[];
  enrollmentMap: Record<string, StudentEnrollment>;
}

function ClassesTable({
  classes,
  enrollmentMap,
}: ClassesTableProps) {
  return (
    <section className="student-classes-table-section">
      <div className="student-classes-table-header">
        <h2>Enrolled Classes</h2>
        <p>Your subjects for the selected academic period.</p>
      </div>

      {classes.length === 0 ? (
        <div className="student-classes-empty">
          <p>No enrolled classes found for this academic period.</p>
        </div>
      ) : (
        <div className="student-classes-table-wrapper">
          <table className="student-classes-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Units</th>
                <th>School Year</th>
                <th>Semester</th>
                <th>Final Grade</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => {
                const enrollment = enrollmentMap[String(cls.id)];

                return (
                  <tr key={cls.id}>
                    <td className="student-classes-code">
                      {cls.subject_code}
                    </td>

                    <td>{cls.subject_name}</td>

                    <td>{cls.units}</td>

                    <td>{cls.school_year}</td>

                    <td>{cls.semester}</td>

                    <td>
                      {enrollment?.final_grade != null
                        ? enrollment.final_grade.toFixed(2)
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

export default ClassesTable;