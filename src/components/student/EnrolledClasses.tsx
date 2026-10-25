import type {
  StudentClass,
  StudentEnrollment,
} from "../../types/student";


interface EnrolledClassesProps {
  classes: StudentClass[];
  enrollmentMap: Record<string, StudentEnrollment>;
}


function EnrolledClasses({
  classes,
  enrollmentMap,
}: EnrolledClassesProps) {

  return (
    <section className="student-enrolled-classes">
      <div className="student-section-header">
        <div>
          <h2>Enrolled Classes</h2>
          <p>Your subjects for the selected semester.</p>
        </div>
      </div>

      <div className="student-table-wrapper">
        <table className="student-classes-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject</th>
              <th>Section</th>
              <th>Schedule</th>
              <th>Units</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((cls) => {
                const enrollment = enrollmentMap[String(cls.id)];

                const finalGrade = enrollment?.final_grade;

                return (
                    <tr key={cls.id}>
                    <td>{cls.subject_code}</td>

                    <td>{cls.subject_name}</td>

                    <td>{cls.school_year}</td>

                    <td>{cls.semester}</td>

                    <td>{cls.units}</td>

                    <td>
                        <span className="student-grade-badge">
                        {finalGrade != null
                            ? finalGrade.toFixed(2)
                            : "—"}
                        </span>
                    </td>
                    </tr>
                );
                })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EnrolledClasses;