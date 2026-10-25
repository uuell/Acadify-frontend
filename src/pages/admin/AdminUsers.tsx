
import { useEffect, useState, type SubmitEvent } from "react";
import axios from "axios";

import api from "../../api/axios";
import "./AdminDashboard.css";
import "./AdminUsers.css";
import StudentAcademicEditor from "./StudentAcademicEditor";
import BulkAcademicUpdates from "./BulkAcademicUpdates";

interface AdminUser {
    user_id: number;
    profile_id: number;
    name: string;
    email: string;
    department: string | null;
    id_number: string;
    role: "Student" | "Teacher";
    initials: string;
    created_at: string | null;
    program?: string | null;
    year_level?: string | null;
    enrollment_classification?: string | null;
    academic_status?: string | null;
}

interface Pagination {
    page: number;
    per_page: number;
    total_users: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}
interface UserManagementResponse {
    success: boolean;
    message?: string;
    users: AdminUser[];
    pagination: Pagination;
    filters?: Record<string, unknown>;
    available_departments?: string[];
}

interface DeleteUserResponse {
    success: boolean;
    message: string;
}

interface ResetPasswordResponse {
    success: boolean;
    message: string;
    temporary_password?: string;
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            return "Your session has expired. Please log in again.";
        }

        if (error.response?.status === 403) {
            return "You do not have permission to manage users.";
        }

        return (
            error.response?.data?.message ||
            "The request could not be completed."
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred.";
}

function formatDate(dateString: string | null): string {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [showBulkAcademic, setShowBulkAcademic] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

    const [resettingUserId, setResettingUserId] = useState<number | null>(null);
    const [resetResult, setResetResult] = useState<{
        name: string;
        message: string;
        temporaryPassword: string;
    } | null>(null);
    const [resetError, setResetError] = useState("");
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [academicStudent, setAcademicStudent] = useState<AdminUser | null>(null);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadUsers() {
            try {
                const response = await api.get<UserManagementResponse>(
                    "/admin/user-management",
                    {
                        params: {
                            page,
                            per_page: 10,
                            search,
                            role,
                            department,
                        }
                    },
                );

                if (cancelled) return;

                if (!response.data.success) {
                    throw new Error(
                        response.data.message || "Unable to load users.",
                    );
                }

                setUsers(response.data.users);
                setPagination(response.data.pagination);
                setAvailableDepartments(response.data.available_departments ?? []);
                setError("");
            } catch (err: unknown) {
                if (cancelled) return;

                console.error("User management error:", err);
                setError(getErrorMessage(err));
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadUsers();

        return () => {
            cancelled = true;
        };
    }, [refreshKey, page, search, role, department]);

    function handleRefresh() {
        setLoading(true);
        setError("");
        setRefreshKey((previous) => previous + 1);
    }

    function handleSearch(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextSearch = searchInput.trim();
        if (nextSearch === search && page === 1) return;
        setLoading(true);
        setPage(1);
        setSearch(nextSearch);
    }


    function handleRoleChange(value: string) {
        if (value === role && page === 1) return;
        setLoading(true);
        setPage(1);
        setRole(value);
    }

    function handleDepartmentChange(value: string) {
        if (value === department && page === 1) return;
        setLoading(true);
        setPage(1);
        setDepartment(value);
    }

    function handleClearFilters() {
        if (!search && !role && !department && page === 1) {
            setSearchInput("");
            return;
        }
        setLoading(true);
        setSearchInput("");
        setSearch("");
        setRole("");
        setDepartment("");
        setPage(1);
    }

    async function handleResetPassword(user: AdminUser) {
        const confirmed = window.confirm(
            `Reset the password for ${user.name} (${user.id_number})?\n\n` +
            `Their password will be reset to their ${user.role === "Student" ? "student number" : "employee number"
            }.`
        );

        if (!confirmed) return;

        setResettingUserId(user.user_id);
        setResetResult(null);
        setResetError("");

        try {
            const response = await api.post<ResetPasswordResponse>(
                `/admin/reset-password/${user.user_id}`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Password reset failed."
                );
            }

            setResetResult({
                name: user.name,
                message: response.data.message,
                temporaryPassword: response.data.temporary_password ?? "",
            });
        } catch (err: unknown) {
            setResetError(getErrorMessage(err));
        } finally {
            setResettingUserId(null);
        }
    }

    async function handleDeleteUser(user: AdminUser) {
        if (deletingUserId !== null || resettingUserId !== null) return;

        const enteredId = window.prompt(
            `PERMANENT DELETE: ${user.name} (${user.role})\n\n` +
            `This may remove associated academic records and cannot be undone.\n` +
            `Type ${user.id_number} to confirm deletion:`
        );
        if (enteredId === null) return;
        if (enteredId.trim() !== user.id_number) {
            setDeleteError("Deletion cancelled: ID number did not match.");
            return;
        }

        setDeletingUserId(user.user_id);
        setDeleteError("");
        setDeleteMessage("");
        setResetResult(null);
        try {
            const response = await api.post<DeleteUserResponse>(
                `/admin/delete-user/${user.user_id}`
            );
            if (!response.data.success) {
                throw new Error(response.data.message || "Unable to delete user.");
            }
            setDeleteMessage(response.data.message);
            setLoading(true);
            setPage(1);
            setRefreshKey((previous) => previous + 1);
        } catch (err: unknown) {
            setDeleteError(getErrorMessage(err));
        } finally {
            setDeletingUserId(null);
        }
    }

    async function handleExportUsers() {
        if (exporting) return;

        setExporting(true);
        setExportError("");

        try {
            const response = await api.get<Blob>(
                "/admin/export-users-csv",
                {
                    responseType: "blob",
                },
            );

            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");

            link.href = url;
            link.download = "acadify_users.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error("User export failed:", error);
            setExportError(
                "Unable to export users. Please try again.",
            );
        } finally {
            setExporting(false);
        }
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-dashboard-header">
                <div>
                    <h1>User Management</h1>
                    <p>View and manage student and teacher accounts.</p>
                </div>

                <button
                    type="button"
                    className="admin-dashboard-refresh"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </header>


            {deleteError && (
                <div className="admin-dashboard-error" role="alert">{deleteError}</div>
            )}
            {deleteMessage && (
                <div className="admin-users-delete-success" role="status">
                    <span>{deleteMessage}</span>
                    <button type="button" onClick={() => setDeleteMessage("")}>Dismiss</button>
                </div>
            )}

            {resetError && (
                <div className="admin-dashboard-error" role="alert">
                    {resetError}
                </div>
            )}

            {resetResult && (
                <div className="admin-password-reset-result" role="status">
                    <div>
                        <h3>Password Reset Successful</h3>
                        <p>{resetResult.message}</p>
                        <p>
                            Account: <strong>{resetResult.name}</strong>
                        </p>

                        <p>
                            Temporary password:{" "}
                            <code>{resetResult.temporaryPassword}</code>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setResetResult(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}


            {error && (
                <div className="admin-dashboard-error" role="alert">
                    <p>{error}</p>

                    <button type="button" onClick={handleRefresh}>
                        Try Again
                    </button>
                </div>
            )}

            <div className="admin-users-tools">
                <button
                    type="button"
                    className={`admin-users-bulk-toggle ${showBulkAcademic ? "is-open" : ""}`}
                    onClick={() => setShowBulkAcademic((previous) => !previous)}
                    aria-expanded={showBulkAcademic}
                    aria-controls="admin-bulk-academic-panel"
                >
                    <span aria-hidden="true">{showBulkAcademic ? "−" : "+"}</span>
                    {showBulkAcademic ? "Close Bulk Academic Updates" : "Bulk Academic Updates"}
                </button>
                <button
                    type="button"
                    className="admin-users-export-button"
                    onClick={() => void handleExportUsers()}
                    disabled={exporting}
                >
                    {exporting ? "Exporting..." : "Export CSV"}
                </button>
                {exportError && (
                    <p className="admin-dashboard-error" role="alert">
                        {exportError}
                    </p>
                )}
            </div>
            <div id="admin-bulk-academic-panel" hidden={!showBulkAcademic}>
                <BulkAcademicUpdates onSuccess={handleRefresh} />
            </div>

            <section className="admin-dashboard-section">
                <div className="admin-dashboard-section-heading">
                    <div>
                        <h2>Registered Users</h2>
                        <p>Students and teachers registered in Acadify.</p>
                    </div>
                </div>


                <div className="admin-users-filters">
                    <form onSubmit={handleSearch} className="admin-users-search">
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search name, email, or ID number"
                            aria-label="Search users"
                        />

                        <button type="submit">Search</button>
                    </form>

                    <div className="admin-users-filter-options">
                        <select
                            value={role}
                            onChange={(event) => handleRoleChange(event.target.value)}
                            aria-label="Filter by role"
                        >
                            <option value="">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Teachers</option>
                        </select>

                        <select
                            value={department}
                            onChange={(event) =>
                                handleDepartmentChange(event.target.value)
                            }
                            aria-label="Filter by department"
                        >
                            <option value="">All Departments</option>

                            {availableDepartments.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <button type="button" onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </div>


                {loading ? (
                    <div className="admin-dashboard-loading">
                        Loading users...
                    </div>
                ) : error ? (
                    <div className="admin-dashboard-empty">
                        Unable to display users. Please try again.
                    </div>
                ) : users.length === 0 ? (
                    <div className="admin-dashboard-empty">
                        No users found.
                    </div>
                ) : (
                    <div className="admin-recent-users-table-wrapper admin-users-table-scroll">
                        <table className="admin-recent-users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ID Number</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Date Added</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.user_id}>
                                        <td>
                                            <div className="admin-user-info">
                                                <div className="admin-user-avatar">
                                                    {user.initials}
                                                </div>

                                                <div className="admin-user-details">
                                                    <strong>{user.name}</strong>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{user.id_number}</td>
                                        <td>{user.email}</td>
                                        <td>{user.department || "N/A"}</td>

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
                                            {user.role === "Student" ? (
                                                <span
                                                    className={`admin-status-badge ${user.academic_status === "Active"
                                                        ? "active"
                                                        : user.academic_status === "Graduated"
                                                            ? "graduated"
                                                            : "inactive"
                                                        }`}
                                                >
                                                    {user.academic_status || "Inactive"}
                                                </span>
                                            ) : (
                                                <span className="admin-status-badge active">
                                                    Teacher
                                                </span>
                                            )}
                                        </td>

                                        <td>{formatDate(user.created_at)}</td>

                                        <td>
                                            {user.role === "Student" && (
                                                <button type="button" className="admin-user-academic-button" onClick={() => setAcademicStudent(user)}>Edit Academic</button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => void handleResetPassword(user)}
                                                disabled={resettingUserId !== null || deletingUserId !== null}
                                                className="admin-user-reset-button"
                                            >
                                                {resettingUserId === user.user_id
                                                    ? "Resetting..."
                                                    : "Reset Password"}
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-user-delete-button"
                                                disabled={deletingUserId !== null || resettingUserId !== null}
                                                onClick={() => void handleDeleteUser(user)}
                                            >
                                                {deletingUserId === user.user_id ? "Deleting..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


                {!loading && !error && pagination && (
                    <div className="admin-users-pagination">
                        <span>
                            {pagination.total_users.toLocaleString()} users found
                        </span>


                        <div className="admin-users-pagination-controls">
                            <button
                                type="button"
                                disabled={loading || !pagination.has_previous}
                                onClick={() => {
                                    setLoading(true);
                                    setPage((previous) => previous - 1);
                                }}
                            >
                                Previous
                            </button>

                            <span>
                                Page {pagination.page} of {Math.max(pagination.total_pages, 1)}
                            </span>

                            <button
                                type="button"
                                disabled={loading || !pagination.has_next}
                                onClick={() => {
                                    setLoading(true);
                                    setPage((previous) => previous + 1);
                                }}
                            >
                                Next
                            </button>
                        </div>

                    </div>
                )}

            </section>
            {academicStudent && (
                <StudentAcademicEditor
                    key={academicStudent.profile_id}
                    student={academicStudent}
                    onClose={() => setAcademicStudent(null)}
                    onSaved={() => { setAcademicStudent(null); handleRefresh(); }}
                />
            )}
        </div>
    );
}

export default AdminUsers;
