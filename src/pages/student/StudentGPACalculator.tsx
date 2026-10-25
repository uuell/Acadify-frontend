import { useEffect, useState } from "react";
import api from "../../api/axios";

import type { StudentGPACalculatorResponse } from "../../types/student";
import GPASummaryCards from "../../components/student/GPASummaryCards";
import GPASubjects from "../../components/student/GPASubjects";
import ProjectedGPACalculator from "../../components/student/ProjectedGPACalculator";

import "./StudentGPACalculator.css";


function StudentGPACalculator() {
    const [gpaData, setGpaData] =
        useState<StudentGPACalculatorResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function fetchGPA() {
            try {
                const response = await api.get<StudentGPACalculatorResponse>(
                    "/student/gpa-calculator"
                );

                if (active) {
                    setGpaData(response.data);
                    setError(null);

                }
            } catch (err) {
                if (active) {
                    console.error("Failed to fetch GPA:", err);
                    setError("Failed to load GPA information.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchGPA();

        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="student-gpa-page">
            <header className="student-page-header">
                <h1>GPA Calculator</h1>
                <p>
                    View your academic GPA and calculate projected results.
                </p>
            </header>

            {loading && <p>Loading GPA information...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && gpaData && (
                <>
                    <GPASummaryCards
                        semesterGPA={gpaData.semester_gpa}
                        cumulativeGPA={gpaData.cumulative_gpa}
                    />

                    <GPASubjects subjects={gpaData.enrolled_classes} />

                    <ProjectedGPACalculator
                        subjects={gpaData.enrolled_classes}
                    />
                </>
            )}
        </div>
    );
}

export default StudentGPACalculator;