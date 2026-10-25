import type {
  StudentProfile,
  StudentProfileResponse,
} from "../../types/student";

interface StudentProfileInfoProps {
  student: StudentProfile;
  studentType: string;
  currentPeriod: StudentProfileResponse["current_period"];
}

function StudentProfileInfo({
  student,
  studentType,
  currentPeriod,
}: StudentProfileInfoProps) {
  const fullName = `${student.first_name} ${student.last_name}`;

  return (
    <section className="student-profile-info-card">
      <h2>Student Information</h2>

      <div className="student-profile-info-grid">
        <div className="student-profile-info-field">
          <span>Student Number</span>
          <strong>{student.student_number}</strong>
        </div>

        <div className="student-profile-info-field">
          <span>Full Name</span>
          <strong>{fullName}</strong>
        </div>

        <div className="student-profile-info-field">
          <span>Program</span>
          <strong>{student.program || "—"}</strong>
        </div>

        <div className="student-profile-info-field">
          <span>Department</span>
          <strong>{student.department || "—"}</strong>
        </div>

        <div className="student-profile-info-field">
          <span>Year Level</span>
          <strong>{student.year_level || "—"}</strong>
        </div>

        <div className="student-profile-info-field">
          <span>Section</span>
          <strong>{student.section || "—"}</strong>
        </div>

        <div className="student-profile-info-field">
          <span>Student Type</span>
          <strong>{studentType}</strong>
        </div>

        <div className="student-profile-info-field">
          <span>Academic Period</span>
          <strong>
            {currentPeriod.school_year} · {currentPeriod.semester}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default StudentProfileInfo;