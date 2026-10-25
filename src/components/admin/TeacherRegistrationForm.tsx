
import { useState, type FormEvent } from "react";
import axios from "axios";

import api from "../../api/axios";
import "./StudentRegistrationForm.css";

interface TeacherRegistrationFormProps {
  onSuccess?: () => void | Promise<void>;
}

interface TeacherFormData {
  full_name: string;
  employee_number: string;
  email: string;
  department: string;
  specialization: string;
  password: string;
  confirm_password: string;
}

interface RegistrationResponse {
  success: boolean;
  message?: string;
}

const initialForm: TeacherFormData = {
  full_name: "",
  employee_number: "",
  email: "",
  department: "",
  specialization: "",
  password: "",
  confirm_password: "",
};

function TeacherRegistrationForm({
  onSuccess,
}: TeacherRegistrationFormProps) {
  const [form, setForm] = useState<TeacherFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<K extends keyof TeacherFormData>(
    field: K,
    value: TeacherFormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError("");
    setSuccess("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        full_name: form.full_name.trim(),
        employee_number: form.employee_number.trim(),
        email: form.email.trim(),
        department: form.department,
        specialization: form.specialization.trim(),
        ...(form.password
          ? {
              password: form.password,
              confirm_password: form.confirm_password,
            }
          : {}),
      };

      const response = await api.post<RegistrationResponse>(
        "/admin/register-teacher",
        payload,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Teacher registration failed.",
        );
      }

      setSuccess(
        response.data.message ||
          "Teacher registered successfully.",
      );

      setForm({ ...initialForm });

      if (onSuccess) {
        try {
          await onSuccess();
        } catch (refreshError) {
          console.error(
            "Teacher registered, but dashboard refresh failed:",
            refreshError,
          );
        }
      }
    } catch (err: unknown) {
      console.error("Teacher registration error:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to register teacher. Please try again.",
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
        <h3>Register Teacher</h3>
        <p>Create a new teacher account in Acadify.</p>
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
            <label htmlFor="teacher-full-name">Full Name</label>
            <input
              id="teacher-full-name"
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
            <label htmlFor="teacher-employee-number">
              Employee Number
            </label>
            <input
              id="teacher-employee-number"
              type="text"
              value={form.employee_number}
              onChange={(event) =>
                updateField("employee_number", event.target.value)
              }
              required
              disabled={submitting}
              placeholder="e.g. T2026001"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="teacher-email">Email Address</label>
            <input
              id="teacher-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              required
              disabled={submitting}
              placeholder="teacher@example.com"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="teacher-department">Department</label>
            <select
              id="teacher-department"
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
            <label htmlFor="teacher-specialization">
              Specialization (Optional)
            </label>
            <input
              id="teacher-specialization"
              type="text"
              value={form.specialization}
              onChange={(event) =>
                updateField("specialization", event.target.value)
              }
              disabled={submitting}
              placeholder="e.g. Computer Engineering"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="teacher-password">
              Password (Optional)
            </label>
            <input
              id="teacher-password"
              type="password"
              value={form.password}
              onChange={(event) =>
                updateField("password", event.target.value)
              }
              disabled={submitting}
              autoComplete="new-password"
              placeholder="Leave blank for default password"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="teacher-confirm-password">
              Confirm Password
            </label>
            <input
              id="teacher-confirm-password"
              type="password"
              value={form.confirm_password}
              onChange={(event) =>
                updateField("confirm_password", event.target.value)
              }
              disabled={submitting}
              autoComplete="new-password"
              placeholder="Confirm custom password"
            />
          </div>
        </div>

        <div className="admin-registration-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Registering..." : "Register Teacher"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TeacherRegistrationForm;
