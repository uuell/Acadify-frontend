
import { useEffect, useState, type SubmitEvent } from "react";
import axios from "axios";
import {
    UserRound,
    BookOpen,
    Users,
    ClipboardCheck,
    CalendarDays,
    Clock3,
    LockKeyhole,
    X,
    RefreshCw,
} from "lucide-react";

import api from "../../api/axios";
import type {
    TeacherProfileResponse,
    TeacherChangePasswordRequest,
    TeacherChangePasswordResponse,
} from "../../types/teacherProfile";

import "./TeacherProfile.css";

export default function TeacherProfile() {
    const [profile, setProfile] = useState<TeacherProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [passwordForm, setPasswordForm] =
        useState<TeacherChangePasswordRequest>({
            current_password: "",
            new_password: "",
            confirm_password: "",
        });

    useEffect(() => {
        let active = true;

        async function loadProfile() {
            try {
                const response = await api.get<TeacherProfileResponse>(
                    "/teacher/profile"
                );

                if (active) {
                    setProfile(response.data);
                    setError("");
                }
            } catch (err) {
                if (active) {
                    setError(
                        axios.isAxiosError(err)
                            ? err.response?.data?.message ?? "Unable to load teacher profile."
                            : "Unable to load teacher profile."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadProfile();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!passwordModalOpen) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !savingPassword) {
                setPasswordModalOpen(false);
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [passwordModalOpen, savingPassword]);

    function closePasswordModal() {
        if (savingPassword) return;

        setPasswordModalOpen(false);
        setPasswordError("");
        setPasswordForm({
            current_password: "",
            new_password: "",
            confirm_password: "",
        });
    }

    async function handleChangePassword(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordError("");
        setSuccessMessage("");

        if (passwordForm.new_password.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setSavingPassword(true);

        try {
            const response = await api.post<TeacherChangePasswordResponse>(
                "/teacher/change-password",
                passwordForm
            );

            if (!response.data.success) {
                setPasswordError(response.data.message);
                return;
            }

            setSuccessMessage(response.data.message);
            setPasswordModalOpen(false);
            setPasswordForm({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (err) {
            setPasswordError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? "Unable to change password."
                    : "Unable to change password."
            );
        } finally {
            setSavingPassword(false);
        }
    }

    if (loading) {
        return (
            <div className="teacher-profile-page">
                <div className="teacher-profile-state">
                    <RefreshCw className="teacher-profile-spin" size={24} />
                    <p>Loading teacher profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="teacher-profile-page">
                <div className="teacher-profile-state">
                    <h2>Unable to load profile</h2>
                    <p>{error || "No profile data was returned."}</p>
                    <button
                        className="teacher-profile-button"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { teacher, statistics, academic_period, recent_activities } = profile;
    const fullName = `${teacher.first_name} ${teacher.last_name}`;
    const initials =
        `${teacher.first_name.charAt(0)}${teacher.last_name.charAt(0)}`.toUpperCase();

    const stats = [
        { label: "Total Classes", value: statistics.total_classes, icon: BookOpen },
        { label: "Current Students", value: statistics.current_students, icon: Users },
        {
            label: "Grades Given",
            value: statistics.total_grades_given,
            icon: ClipboardCheck,
        },
        {
            label: "Years Teaching",
            value: statistics.years_teaching,
            icon: CalendarDays,
        },
    ];

    return (
        <div className="teacher-profile-page">
            <header className="teacher-profile-header">
                <div className="teacher-profile-avatar">{initials}</div>

                <div className="teacher-profile-identity">
                    <div className="teacher-profile-eyebrow">Faculty Profile</div>
                    <h1>{fullName}</h1>
                    <p>{teacher.employee_number}</p>

                    <div className="teacher-profile-tags">
                        <span>{teacher.department || "Department not assigned"}</span>
                        {statistics.total_classes >= 5 && (
                            <span className="teacher-profile-senior">Senior Faculty</span>
                        )}
                    </div>
                </div>
            </header>

            {successMessage && (
                <div className="teacher-profile-success" role="status">
                    {successMessage}
                    <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={() => setSuccessMessage("")}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <section className="teacher-profile-stats">
                {stats.map(({ label, value, icon: Icon }) => (
                    <article className="teacher-profile-stat" key={label}>
                        <div className="teacher-profile-stat-icon">
                            <Icon size={20} />
                        </div>
                        <strong>{value}</strong>
                        <span>{label}</span>
                    </article>
                ))}
            </section>

            <div className="teacher-profile-grid">
                <section className="teacher-profile-card">
                    <h2><UserRound size={19} /> Personal Information</h2>

                    <div className="teacher-profile-fields">
                        <div>
                            <span>First Name</span>
                            <strong>{teacher.first_name}</strong>
                        </div>
                        <div>
                            <span>Last Name</span>
                            <strong>{teacher.last_name}</strong>
                        </div>
                        <div>
                            <span>Employee Number</span>
                            <strong>{teacher.employee_number}</strong>
                        </div>
                        <div>
                            <span>Department</span>
                            <strong>{teacher.department || "Not specified"}</strong>
                        </div>
                        <div>
                            <span>Specialization</span>
                            <strong>{teacher.specialization || "Not specified"}</strong>
                        </div>
                        <div>
                            <span>Current Academic Period</span>
                            <strong>
                                {academic_period.school_year} — {academic_period.semester}
                            </strong>
                        </div>
                        <div>
                            <span>Faculty Since</span>
                            <strong>
                                {teacher.created_at
                                    ? new Date(teacher.created_at).toLocaleDateString()
                                    : "Not available"}
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="teacher-profile-card">
                    <h2><Clock3 size={19} /> Recent Activity</h2>

                    {recent_activities.length === 0 ? (
                        <p className="teacher-profile-empty">
                            No recent grading activity.
                        </p>
                    ) : (
                        <div className="teacher-profile-activities">
                            {recent_activities.map((activity) => (
                                <article
                                    className="teacher-profile-activity"
                                    key={activity.grade_id}
                                >
                                    <div className="teacher-profile-activity-icon">
                                        <ClipboardCheck size={17} />
                                    </div>
                                    <div>
                                        <strong>
                                            Graded {activity.student.first_name}{" "}
                                            {activity.student.last_name}
                                        </strong>
                                        <p>
                                            {activity.test.title} · {activity.class.subject_code}
                                        </p>
                                        <small>{activity.time_ago}</small>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="teacher-profile-card teacher-profile-settings">
                    <h2><LockKeyhole size={19} /> Account Settings</h2>
                    <p>Manage your account security and password.</p>

                    <button
                        className="teacher-profile-button"
                        type="button"
                        onClick={() => {
                            setPasswordError("");
                            setPasswordModalOpen(true);
                        }}
                    >
                        <LockKeyhole size={17} />
                        Change Password
                    </button>
                </section>
            </div>

            {passwordModalOpen && (
                <div
                    className="teacher-profile-modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closePasswordModal();
                        }
                    }}
                >
                    <div
                        className="teacher-profile-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="teacher-profile-password-title"
                    >
                        <div className="teacher-profile-modal-header">
                            <h2 id="teacher-profile-password-title">Change Password</h2>
                            <button
                                type="button"
                                onClick={closePasswordModal}
                                disabled={savingPassword}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword}>
                            <label>
                                Current Password
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={passwordForm.current_password}
                                    onChange={(event) =>
                                        setPasswordForm((previous) => ({
                                            ...previous,
                                            current_password: event.target.value,
                                        }))
                                    }
                                />
                            </label>

                            <label>
                                New Password
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    value={passwordForm.new_password}
                                    onChange={(event) =>
                                        setPasswordForm((previous) => ({
                                            ...previous,
                                            new_password: event.target.value,
                                        }))
                                    }
                                />
                            </label>

                            <label>
                                Confirm New Password
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={passwordForm.confirm_password}
                                    onChange={(event) =>
                                        setPasswordForm((previous) => ({
                                            ...previous,
                                            confirm_password: event.target.value,
                                        }))
                                    }
                                />
                            </label>

                            {passwordError && (
                                <p className="teacher-profile-form-error" role="alert">
                                    {passwordError}
                                </p>
                            )}

                            <div className="teacher-profile-modal-actions">
                                <button
                                    type="button"
                                    className="teacher-profile-button-secondary"
                                    onClick={closePasswordModal}
                                    disabled={savingPassword}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="teacher-profile-button"
                                    disabled={savingPassword}
                                >
                                    {savingPassword ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
