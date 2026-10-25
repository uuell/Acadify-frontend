import type { StudentSubjectGrade } from "../../types/student";
import AssessmentBreakdown from "./AssessmentBreakdown";

interface SubjectGradeCardProps {
    subject: StudentSubjectGrade;
}

function SubjectGradeCard({ subject }: SubjectGradeCardProps) {
    const classInfo = subject.class;

    return (
        <article className="student-subject-grade-card">
            <div className="student-subject-grade-header">
                <div className="student-subject-grade-info">
                    <span className="student-subject-grade-code">
                        {classInfo.subject_code}
                    </span>

                    <h2>{classInfo.subject_name}</h2>

                    <p>
                        {classInfo.units} Units · {classInfo.school_year} ·{" "}
                        {classInfo.semester}
                    </p>
                </div>

                <div className="student-subject-final-grade">
                    <span>Final Grade</span>

                    <strong>
                        {subject.final_grade != null
                            ? subject.final_grade.toFixed(2)
                            : "—"}
                    </strong>
                </div>
            </div>

            <div className="student-subject-formula">
                <h3>Grading Formula</h3>

                <div className="student-subject-formula-grid">
                    {subject.formula_components.map((component) => (
                        <div
                            className="student-subject-formula-item"
                            key={component.name}
                        >
                            <span>{component.name}</span>
                            <strong>{component.weight}%</strong>
                        </div>
                    ))}
                </div>
            </div>

            <AssessmentBreakdown
                tests={subject.tests}
                testGrades={subject.test_grades}
            />
        </article>
    );
}

export default SubjectGradeCard;