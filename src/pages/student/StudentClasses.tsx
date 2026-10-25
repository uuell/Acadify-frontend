import { useEffect, useState } from "react";
import api from "../../api/axios";

import type { StudentClassesResponse } from "../../types/student";
import ClassesStats from "../../components/student/ClassesStats";
import ClassesTable from "../../components/student/ClassesTable";
import "./StudentClasses.css";

function StudentClasses() {
    const [classesData, setClassesData] = useState<StudentClassesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [schoolYear, setSchoolYear] = useState("");
    const [semester, setSemester] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchClasses() {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<StudentClassesResponse>(
                    "/student/classes",
                    {
                        params: {
                            year: schoolYear || undefined,
                            semester: semester || undefined,
                        },
                    }
                );

                if (active) {
                    setClassesData(response.data);
                    setError(null);

                }
            } catch (err) {
                setClassesData(null);

                if (active) {
                    console.error("Failed to fetch classes:", err);
                    setError("Failed to load your classes.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchClasses();

        return () => {
            active = false;
        };
    }, [schoolYear, semester]);

    return (
        <div className="student-classes-page">
            <header className="student-page-header">
                <h1>My Classes</h1>
                <p>View your enrolled classes and academic information.</p>
            </header>

            <div className="student-classes-filters">
                <div className="student-classes-filter">
                    <label htmlFor="classes-school-year">
                        School Year
                    </label>

                    <select
                        id="classes-school-year"
                        value={schoolYear}
                        onChange={(e) => setSchoolYear(e.target.value)}
                    >
                        <option value="">
                            {classesData?.period.current_school_year ??
                                "Current School Year"}
                        </option>

                        {classesData?.available_years
                            .filter(
                                (year) =>
                                    year !== classesData.period.current_school_year
                            )
                            .map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="student-classes-filter">
                    <label htmlFor="classes-semester">
                        Semester
                    </label>

                    <select
                        id="classes-semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    >
                        <option value="">
                            {classesData?.period.current_semester ??
                                "Current Semester"}
                        </option>

                        {["1st Semester", "2nd Semester"]
                            .filter(
                                (value) =>
                                    value !== classesData?.period.current_semester
                            )
                            .map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {loading && <p>Loading classes...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && classesData && (
            <>
                <ClassesStats stats={classesData.stats} />

                <ClassesTable
                classes={classesData.classes}
                enrollmentMap={classesData.enrollment_map}
                />
            </>
            )}
        </div>
    );
}

export default StudentClasses;