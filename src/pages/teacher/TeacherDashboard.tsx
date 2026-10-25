
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import api from "../../api/axios";

import type { TeacherDashboardResponse } from "../../types/teacher";
import TeacherDashboardStats from "../../components/teacher/TeacherDashboardStats";
import TeacherDashboardHeader from "../../components/teacher/TeacherDashboardHeader";
import TeacherDashboardClasses from "../../components/teacher/TeacherDashboardClasses";

import "./TeacherDashboard.css";


function TeacherDashboard() {
    const [dashboard, setDashboard] =
        useState<TeacherDashboardResponse | null>(null);

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] =
        useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleFilterChange = useCallback(
        (year: string, semester: string) => {
            setSelectedYear(year);
            setSelectedSemester(semester);
        },
        [],
    );

    useEffect(() => {
        const controller = new AbortController();

        async function fetchDashboard() {
            try {
                setLoading(true);
                setError("");

                const response = await api.get<TeacherDashboardResponse>(
                    "/teacher/dashboard",
                    {
                        params: {
                            ...(selectedYear !== null && { year: selectedYear }),
                            ...(selectedSemester !== null && {
                                semester: selectedSemester,
                            }),
                        },
                        signal: controller.signal,
                    },
                );

                setDashboard(response.data);
            } catch (error) {
                if (controller.signal.aborted) return;

                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ||
                        "Unable to load the teacher dashboard.",
                    );
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchDashboard();

        return () => controller.abort();
    }, [selectedYear, selectedSemester]);

    if (loading && !dashboard) {
        return <p>Loading teacher dashboard...</p>;
    }

    if (error && !dashboard) {
        return <p role="alert">{error}</p>;
    }

    if (!dashboard) {
        return <p>No dashboard data available.</p>;
    }

    return (
        <div className="teacher-dashboard">
            <TeacherDashboardHeader
                dashboard={dashboard}
                onFilterChange={handleFilterChange}
            />

            {error && <p role="alert">{error}</p>}

            <TeacherDashboardStats statistics={dashboard.statistics} />
            <TeacherDashboardClasses classes={dashboard.classes} />
        </div>
    );
}

export default TeacherDashboard;

