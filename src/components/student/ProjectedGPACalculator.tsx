import { useState } from "react";
import { calculateProjectedGPA } from "../../utils/gpaCalculator";

import type { StudentGPASubject } from "../../types/student";
import type { ProjectedSubject } from "../../utils/gpaCalculator";

interface ProjectedGPACalculatorProps {
    subjects: StudentGPASubject[];
}

function ProjectedGPACalculator({
    subjects,
}: ProjectedGPACalculatorProps) {
    const [projectedSubjects, setProjectedSubjects] = useState<
        ProjectedSubject[]
    >(() =>
        subjects.map((subject) => ({
            subject_code: subject.subject_code,
            subject_name: subject.subject_name,
            units: subject.units,
            grade: subject.current_grade,
            is_major_subject: subject.is_major_subject,
        }))
    );
    const projectedWeightedGPA = calculateProjectedGPA(
        projectedSubjects,
        "weighted"
    );

    const projectedSimpleGPA = calculateProjectedGPA(
        projectedSubjects,
        "simple"
    );

    const projectedMajorGPA = calculateProjectedGPA(
        projectedSubjects,
        "major_only"
    );

    function updateGrade(index: number, value: string) {
        const parsedGrade = value === "" ? null : Number(value);

        if (
            parsedGrade !== null &&
            (!Number.isFinite(parsedGrade) ||
                parsedGrade < 1 ||
                parsedGrade > 5)
        ) {
            return;
        }

        setProjectedSubjects((previous) =>
            previous.map((subject, subjectIndex) =>
                subjectIndex === index
                    ? { ...subject, grade: parsedGrade }
                    : subject
            )
        );
    }

    function resetGrades() {
        setProjectedSubjects(
            subjects.map((subject) => ({
                subject_code: subject.subject_code,
                subject_name: subject.subject_name,
                units: subject.units,
                grade: subject.current_grade,
                is_major_subject: subject.is_major_subject,
            }))
        );
    }

    return (
        <section className="student-projected-gpa">
            <div className="student-projected-gpa-header">
                <div>
                    <h2>Projected GPA Calculator</h2>
                    <p>
                        Experiment with hypothetical grades without changing
                        your official academic records.
                    </p>
                </div>

                <button type="button" onClick={resetGrades}>
                    Reset Grades
                </button>
            </div>

            {projectedSubjects.length === 0 ? (
                <p>No subjects available for GPA projection.</p>
            ) : (
                <>
                    <div className="student-projected-gpa-list">
                        {projectedSubjects.map((subject, index) => (
                            <div
                                className="student-projected-gpa-row"
                                key={`${subject.subject_code}-${index}`}
                            >
                                <div className="student-projected-gpa-info">
                                    <strong>{subject.subject_code}</strong>
                                    <span>{subject.subject_name}</span>
                                    <small>{subject.units} units</small>
                                </div>

                                <div className="student-projected-gpa-input">
                                    <label htmlFor={`projected-grade-${index}`}>
                                        Hypothetical Grade
                                    </label>

                                    <input
                                        id={`projected-grade-${index}`}
                                        type="number"
                                        min="1"
                                        max="5"
                                        step="0.25"
                                        value={subject.grade ?? ""}
                                        onChange={(event) =>
                                            updateGrade(index, event.target.value)
                                        }
                                        placeholder="—"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="student-projected-gpa-results">
                        <h3>Projected GPA Results</h3>

                        <div className="student-projected-gpa-results-grid">
                            <div className="student-projected-gpa-result-card">
                                <p>Weighted GPA</p>
                                <strong>
                                    {projectedWeightedGPA !== null
                                        ? projectedWeightedGPA.toFixed(2)
                                        : "—"}
                                </strong>
                            </div>

                            <div className="student-projected-gpa-result-card">
                                <p>Simple GPA</p>
                                <strong>
                                    {projectedSimpleGPA !== null
                                        ? projectedSimpleGPA.toFixed(2)
                                        : "—"}
                                </strong>
                            </div>

                            <div className="student-projected-gpa-result-card">
                                <p>Major-Only GPA</p>
                                <strong>
                                    {projectedMajorGPA !== null
                                        ? projectedMajorGPA.toFixed(2)
                                        : "—"}
                                </strong>
                            </div>
                        </div>

                        <p className="student-projected-gpa-disclaimer">
                            These are hypothetical GPA estimates. Your official grades
                            and GPA records remain unchanged.
                        </p>
                    </div>
                </>
            )}
        </section>
    );
}

export default ProjectedGPACalculator;