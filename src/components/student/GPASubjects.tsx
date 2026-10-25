import type { StudentGPASubject } from "../../types/student";

interface GPASubjectsProps {
  subjects: StudentGPASubject[];
}

function GPASubjects({ subjects }: GPASubjectsProps) {
  return (
    <section className="student-gpa-subjects">
      <div className="student-gpa-subjects-header">
        <h2>Current Enrolled Subjects</h2>
        <p>Subjects and grades for the current academic period.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="student-gpa-subjects-empty">
          <p>No enrolled subjects found.</p>
        </div>
      ) : (
        <div className="student-gpa-subjects-table-wrapper">
          <table className="student-gpa-subjects-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Units</th>
                <th>Current Grade</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((subject, index) => (
                <tr key={`${subject.subject_code}-${index}`}>
                  <td className="student-gpa-subject-code">
                    {subject.subject_code}
                  </td>

                  <td>{subject.subject_name}</td>

                  <td>{subject.units}</td>

                  <td className="student-gpa-subject-grade">
                    {subject.current_grade != null
                      ? subject.current_grade.toFixed(2)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default GPASubjects;