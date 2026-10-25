import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import api from "../../api/axios";
import "./StudentLogin.css";

function StudentLogin() {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/student-login", {
        student_number: studentNumber,
        password,
      });

      await refreshUser();
      navigate("/student/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to sign in. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-page">
      <div className="student-login-card">
        <div className="student-login-header">
          <div className="student-login-logo">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>

            Acadify
          </div>

          <p className="student-login-subtitle">
            Student Portal Login
          </p>
          {error && (
            <div className="student-login-alert">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="student-login-form-group">
            <label htmlFor="student_number">Student ID</label>
            <input
              type="text"
              id="student_number"
              name="student_number"
              placeholder="Enter your ID number"
              value={studentNumber}
              onChange={(event) => setStudentNumber(event.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="student-login-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          </div>

          <button
            type="submit"
            className="student-login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="student-login-divider" />

        <div className="student-login-footer-links">
          <p>
            <Link to="/forgot-password">
              Forgot your password?
            </Link>
          </p>

          <p className="student-login-new-student">
            New student? Contact Registrar
          </p>
        </div>

        <div className="student-login-back-home">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;