
import { useState, type FormEvent } from "react";
import axios from "axios";

import api from "../../api/axios";

import "./StudentRegistrationForm.css";

interface StudentRegistrationFormProps {
    onSuccess?: () => void | Promise<void>;
}

interface StudentFormData {
    full_name: string;
    student_number: string;
    email: string;
    department: string;
    program: string;
    year_level: string;
    enrollment_classification:
    | "Regular"
    | "Irregular"
    | "Not Yet Verified";
}

interface RegistrationResponse {
    success: boolean;
    message?: string;
    default_password?: string;
}

const initialForm: StudentFormData = {
    full_name: "",
    student_number: "",
    email: "",
    department: "",
    program: "",
    year_level: "",
    enrollment_classification: "Not Yet Verified",
};

function StudentRegistrationForm({
    onSuccess,
}: StudentRegistrationFormProps) {
    const [form, setForm] = useState<StudentFormData>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function updateField<K extends keyof StudentFormData>(
        field: K,
        value: StudentFormData[K],
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (submitting) return;

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.post<RegistrationResponse>(
                "/admin/register-student",
                {
                    full_name: form.full_name.trim(),
                    student_number: form.student_number.trim(),
                    email: form.email.trim(),
                    department: form.department,
                    program: form.program.trim(),
                    year_level: form.year_level,
                    enrollment_classification:
                        form.enrollment_classification,
                },
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Registration failed.",
                );
            }

            setSuccess(
                response.data.message ||
                "Student registered successfully.",
            );

            setForm(initialForm);

            if (onSuccess) {
                try {
                    await onSuccess();
                } catch (refreshError) {
                    console.error(
                        "Student registered, but dashboard refresh failed:",
                        refreshError,
                    );
                }
            }
        } catch (err: unknown) {
            console.error("Student registration failed:", err);

            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    "Unable to register student. Please try again.",
                );
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="admin-registration-form">
            <div className="admin-registration-heading">
                <h3>Register Student</h3>
                <p>Create a new student account in Acadify.</p>
            </div>

            {error && (
                <p className="admin-registration-error" role="alert">
                    {error}
                </p>
            )}

            {success && (
                <p className="admin-registration-success" role="status">
                    {success}
                </p>
            )}

            <form onSubmit={(event) => void handleSubmit(event)}>
                <div className="admin-registration-grid">
                    <div className="admin-form-field">
                        <label htmlFor="student-full-name">Full Name</label>
                        <input
                            id="student-full-name"
                            type="text"
                            value={form.full_name}
                            onChange={(event) =>
                                updateField("full_name", event.target.value)
                            }
                            required
                            disabled={submitting}
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="student-number">Student Number</label>
                        <input
                            id="student-number"
                            type="text"
                            value={form.student_number}
                            onChange={(event) =>
                                updateField("student_number", event.target.value)
                            }
                            required
                            disabled={submitting}
                            placeholder="e.g. 20260001"
                        />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="student-email">Email Address</label>
                        <input
                            id="student-email"
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                                updateField("email", event.target.value)
                            }
                            required
                            disabled={submitting}
                            placeholder="student@example.com"
                        />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="student-department">Department</label>
                        <select
                            id="student-department"
                            value={form.department}
                            onChange={(event) =>
                                updateField("department", event.target.value)
                            }
                            required
                            disabled={submitting}
                        >
                            <option value="">Select department</option>
                            <option value="College of Engineering">
                                College of Engineering
                            </option>
                            <option value="College of Science">
                                College of Science
                            </option>
                            <option value="College of Education">
                                College of Education
                            </option>
                            <option value="College of Industrial Technology">
                                College of Industrial Technology
                            </option>
                        </select>
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="student-program">Program</label>
                        <input
                            id="student-program"
                            type="text"
                            value={form.program}
                            onChange={(event) =>
                                updateField("program", event.target.value)
                            }
                            required
                            disabled={submitting}
                            placeholder="e.g. BS Computer Engineering"
                        />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="student-year-level">Year Level</label>
                        <select
                            id="student-year-level"
                            value={form.year_level}
                            onChange={(event) =>
                                updateField("year_level", event.target.value)
                            }
                            required
                            disabled={submitting}
                        >
                            <option value="">Select year level</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="5th Year">5th Year</option>
                        </select>
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="student-classification">
                            Enrollment Classification
                        </label>
                        <select
                            id="student-classification"
                            value={form.enrollment_classification}
                            onChange={(event) =>
                                updateField(
                                    "enrollment_classification",
                                    event.target.value as StudentFormData[
                                    "enrollment_classification"
                                    ],
                                )
                            }
                            disabled={submitting}
                        >
                            <option value="Not Yet Verified">
                                Not Yet Verified
                            </option>
                            <option value="Regular">Regular</option>
                            <option value="Irregular">Irregular</option>
                        </select>
                    </div>
                </div>

                <div className="admin-registration-actions">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Registering..." : "Register Student"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default StudentRegistrationForm;
