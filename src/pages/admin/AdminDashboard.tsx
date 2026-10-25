
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import api from "../../api/axios";

import StudentRegistrationForm from "../../components/admin/StudentRegistrationForm";
import TeacherRegistrationForm from "../../components/admin/TeacherRegistrationForm";
import BulkImportForm from "../../components/admin/BulkImportForm";
import "./AdminDashboard.css";

/* =========================================
   TYPES
========================================= */

interface DashboardStatistics {
    total_students: number;
    total_teachers: number;
    new_users_today: number;
}

interface DepartmentStatistics {
    name: string;
    student_count: number;
    teacher_count: number;
}

interface RecentUser {
    name: string;
    email: string;
    id_number: string;
    role: "Student" | "Teacher";
    initials: string;
    date_added: string | null;
    status: string;
}

interface AdminDashboardResponse {
    success: boolean;
    message?: string;
    statistics: DashboardStatistics;
    departments: DepartmentStatistics[];
    recent_users: RecentUser[];
}

/* =========================================
   HELPERS
========================================= */

function formatDate(dateString: string | null): string {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            return "Your session has expired. Please log in again.";
        }

        if (error.response?.status === 403) {
            return "You do not have permission to view this dashboard.";
        }

        return (
            error.response?.data?.message ||
            "Unable to load dashboard information."
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred.";
}
/* =========================================
   COMPONENT
========================================= */

function AdminDashboard() {
    const [dashboard, setDashboard] =
        useState<AdminDashboardResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [registrationTab, setRegistrationTab] = useState<
        "student" | "teacher" | "bulk"
    >("student");


    async function fetchDashboard() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get<AdminDashboardResponse>(
                "/admin/dashboard",
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Unable to load dashboard.",
                );
            }

            setDashboard(response.data);
        } catch (error: unknown) {
            console.error("Admin dashboard error:", error);

            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            try {
                const response = await api.get<AdminDashboardResponse>(
                    "/admin/dashboard",
                );

                if (cancelled) return;

                if (!response.data.success) {
                    throw new Error(
                        response.data.message ||
                        "Unable to load dashboard.",
                    );
                }

                setDashboard(response.data);
            } catch (error: unknown) {
                if (cancelled) return;

                console.error("Admin dashboard error:", error);
                setError(getErrorMessage(error));
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadDashboard();

        return () => {
            cancelled = true;
        };
    }, []);


    const statistics = dashboard?.statistics;
    const departments = dashboard?.departments ?? [];
    const recentUsers = dashboard?.recent_users ?? [];

    return (
        <div className="admin-dashboard">
            {/* PAGE HEADER */}
            <header className="admin-dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>
                        System Overview &amp; User Registration
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-dashboard-refresh"
                    onClick={() => void fetchDashboard()}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {/* ERROR MESSAGE */}
            {error && (
                <div
                    className="admin-dashboard-error"
                    role="alert"
                >
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() => void fetchDashboard()}
                        disabled={loading}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* LOADING STATE */}
            {loading && !dashboard && (
                <div
                    className="admin-dashboard-loading"
                    role="status"
                >
                    Loading dashboard information...
                </div>
            )}

            {/* DASHBOARD CONTENT */}
            {dashboard && (
                <>
                    {/* STATISTICS */}
                    <section
                        className="admin-dashboard-section"
                        aria-labelledby="admin-statistics-title"
                    >
                        <div className="admin-dashboard-section-heading">
                            <h2 id="admin-statistics-title">
                                System Overview
                            </h2>
                        </div>

                        <div className="admin-stats-grid">
                            <article className="admin-stat-card">
                                <span className="admin-stat-label">
                                    Total Students
                                </span>

                                <strong className="admin-stat-value">
                                    {statistics?.total_students.toLocaleString() ??
                                        0}
                                </strong>

                                <span className="admin-stat-description">
                                    Registered student accounts
                                </span>
                            </article>

                            <article className="admin-stat-card">
                                <span className="admin-stat-label">
                                    Total Teachers
                                </span>

                                <strong className="admin-stat-value">
                                    {statistics?.total_teachers.toLocaleString() ??
                                        0}
                                </strong>

                                <span className="admin-stat-description">
                                    Registered faculty accounts
                                </span>
                            </article>

                            <article className="admin-stat-card">
                                <span className="admin-stat-label">
                                    New Today
                                </span>

                                <strong className="admin-stat-value">
                                    {statistics?.new_users_today.toLocaleString() ??
                                        0}
                                </strong>

                                <span className="admin-stat-description">
                                    New accounts registered today
                                </span>
                            </article>
                        </div>
                    </section>


                    {/* USER REGISTRATION */}
                    <section
                        className="admin-dashboard-section"
                        aria-labelledby="admin-registration-title"
                    >
                        <div className="admin-dashboard-section-heading">
                            <h2 id="admin-registration-title">
                                User Registration
                            </h2>
                        </div>

                        <div
                            className="admin-registration-tabs"
                            role="tablist"
                            aria-label="Registration type"
                        >
                            <button
                                type="button"
                                id="student-registration-tab"
                                role="tab"
                                aria-selected={registrationTab === "student"}
                                aria-controls="student-registration-panel"
                                className={
                                    registrationTab === "student" ? "active" : ""
                                }
                                onClick={() => setRegistrationTab("student")}
                            >
                                Register Student
                            </button>

                            <button
                                type="button"
                                id="teacher-registration-tab"
                                role="tab"
                                aria-selected={registrationTab === "teacher"}
                                aria-controls="teacher-registration-panel"
                                className={
                                    registrationTab === "teacher" ? "active" : ""
                                }
                                onClick={() => setRegistrationTab("teacher")}
                            >
                                Register Teacher
                            </button>

                            <button
                                type="button"
                                id="bulk-import-tab"
                                role="tab"
                                aria-selected={registrationTab === "bulk"}
                                aria-controls="bulk-import-panel"
                                className={registrationTab === "bulk" ? "active" : ""}
                                onClick={() => setRegistrationTab("bulk")}
                            >
                                Bulk Import
                            </button>
                        </div>

                        <div
                            id="student-registration-panel"
                            role="tabpanel"
                            aria-labelledby="student-registration-tab"
                            hidden={registrationTab !== "student"}
                        >
                            {registrationTab === "student" && (
                                <StudentRegistrationForm onSuccess={fetchDashboard} />
                            )}
                        </div>

                        <div
                            id="teacher-registration-panel"
                            role="tabpanel"
                            aria-labelledby="teacher-registration-tab"
                            hidden={registrationTab !== "teacher"}
                        >
                            {registrationTab === "teacher" && (
                                <TeacherRegistrationForm onSuccess={fetchDashboard} />
                            )}
                        </div>

                        <div
                            id="bulk-import-panel"
                            role="tabpanel"
                            aria-labelledby="bulk-import-tab"
                            hidden={registrationTab !== "bulk"}
                        >
                            {registrationTab === "bulk" && (
                                <BulkImportForm onSuccess={fetchDashboard} />
                            )}
                        </div>
                    </section>


                    {/* DEPARTMENT OVERVIEW */}
                    <section
                        className="admin-dashboard-section"
                        aria-labelledby="admin-departments-title"
                    >
                        <div className="admin-dashboard-section-heading">
                            <div>
                                <h2 id="admin-departments-title">
                                    Department Overview
                                </h2>

                                <p>
                                    Student and teacher distribution by
                                    department
                                </p>
                            </div>
                        </div>

                        {departments.length === 0 ? (
                            <div className="admin-dashboard-empty">
                                No department records available.
                            </div>
                        ) : (
                            <div className="admin-departments-grid">
                                {departments.map((department) => (
                                    <article
                                        key={department.name}
                                        className="admin-department-card"
                                    >
                                        <h3>{department.name}</h3>

                                        <div className="admin-department-counts">
                                            <div>
                                                <span>Students</span>

                                                <strong>
                                                    {department.student_count.toLocaleString()}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Teachers</span>

                                                <strong>
                                                    {department.teacher_count.toLocaleString()}
                                                </strong>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* RECENT USERS */}
                    <section
                        className="admin-dashboard-section"
                        aria-labelledby="admin-recent-users-title"
                    >
                        <div className="admin-dashboard-section-heading">
                            <div>
                                <h2 id="admin-recent-users-title">
                                    Recently Registered Users
                                </h2>

                                <p>
                                    Latest student and teacher registrations
                                </p>
                            </div>

                            <Link
                                to="/admin/users"
                                className="admin-dashboard-view-all"
                            >
                                View All Users
                            </Link>
                        </div>

                        {recentUsers.length === 0 ? (
                            <div className="admin-dashboard-empty">
                                No recent registrations.
                            </div>
                        ) : (
                            <div className="admin-recent-users-table-wrapper">
                                <table className="admin-recent-users-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>ID Number</th>
                                            <th>Role</th>
                                            <th>Registered</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentUsers.map((user) => (
                                            <tr
                                                key={`${user.role}-${user.id_number}`}
                                            >
                                                <td>
                                                    <div className="admin-user-info">
                                                        <div className="admin-user-avatar">
                                                            {user.initials}
                                                        </div>

                                                        <div className="admin-user-details">
                                                            <strong>{user.name}</strong>
                                                            <span>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>{user.id_number}</td>

                                                <td>
                                                    <span
                                                        className={`admin-role-badge ${user.role === "Teacher"
                                                            ? "teacher"
                                                            : "student"
                                                            }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatDate(user.date_added)}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`admin-status-badge ${user.status === "Active"
                                                            ? "active"
                                                            : user.status === "Graduated"
                                                                ? "graduated"
                                                                : "inactive"
                                                            }`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
