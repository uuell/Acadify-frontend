import { useEffect, useState } from "react";
import api from "../../api/axios";

import type { StudentGradesResponse } from "../../types/student";
import SubjectGradeCard from "../../components/student/SubjectGradeCard";

import "./StudentGrades.css";

function StudentGrades() {
    const [gradesData, setGradesData] = useState<StudentGradesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [schoolYear, setSchoolYear] = useState("");
    const [semester, setSemester] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchGrades() {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<StudentGradesResponse>(
                    "/student/grades",
                    {
                        params: {
                            year: schoolYear || undefined,
                            semester: semester || undefined,
                        },
                    }
                );

                if (active) {
                    setGradesData(response.data);
                    setError(null);

                    console.log("Student Grades:", response.data);
                }
            } catch (err) {
                if (active) {
                    setGradesData(null);
                    console.error("Failed to fetch grades:", err);
                    setError("Failed to load your grades.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchGrades();

        return () => {
            active = false;
        };
    }, [schoolYear, semester]);

    return (
        <div className="student-grades-page">
            <header className="student-page-header">
                <h1>My Grades</h1>
                <p>
                    View your grades, assessments, and academic performance.
                </p>
            </header>

            <div className="student-grades-filters">
                <div className="student-grades-filter">
                    <label htmlFor="grades-school-year">School Year</label>

                    <select
                        id="grades-school-year"
                        value={schoolYear}
                        onChange={(e) => setSchoolYear(e.target.value)}
                    >
                        <option value="">Current School Year</option>

                        {gradesData?.available_years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="student-grades-filter">
                    <label htmlFor="grades-semester">Semester</label>

                    <select
                        id="grades-semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    >
                        <option value="">Current Semester</option>
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                    </select>
                </div>
            </div>

            {loading && <p>Loading grades...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && gradesData && (
                <div className="student-grades-subjects">
                    {gradesData.classes.length === 0 ? (
                        <div className="student-grades-empty">
                            <p>No grades found for this academic period.</p>
                        </div>
                    ) : (
                        gradesData.classes.map((subject) => (
                            <SubjectGradeCard
                                key={subject.class.id}
                                subject={subject}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default StudentGrades;