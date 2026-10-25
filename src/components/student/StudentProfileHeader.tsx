import type {
    StudentProfile,
    StudentProfileAcademicStanding,
} from "../../types/student";

interface StudentProfileHeaderProps {
    student: StudentProfile;
    academicStanding: StudentProfileAcademicStanding;
    studentType: string;
    isDeansLister: boolean;
}

function StudentProfileHeader({
    student,
    academicStanding,
    studentType,
    isDeansLister,
}: StudentProfileHeaderProps) {
    const fullName = `${student.first_name} ${student.last_name}`;

    return (
        <section className="student-profile-header-card">
            <div className="student-profile-avatar">
                <span>
                    {student.first_name.charAt(0)}
                    {student.last_name.charAt(0)}
                </span>
            </div>

            <div className="student-profile-header-info">
                <h2>{fullName}</h2>

                <p className="student-profile-subtitle">
                    {student.student_number} · {student.program}
                </p>

                <div className="student-profile-badges">
                    <span
                        className={`student-profile-standing ${academicStanding.standing === "Good Standing"
                            ? "student-profile-standing--good"
                            : "student-profile-standing--other"
                            }`}
                    >
                        {academicStanding.standing}
                    </span>

                    <span className="student-profile-type">
                        {studentType}
                    </span>

                    {isDeansLister && (
                        <span className="student-profile-deans-badge">
                            ★ Dean's Lister
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}

export default StudentProfileHeader;