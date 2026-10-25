
import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

import "./TeacherLogin.css";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/teacher-login", {
        email: email.trim(),
        password,
      });

      await refreshUser();

      navigate("/teacher/dashboard", { replace: true });
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
    <div className="teacher-login-page">
      <div className="teacher-login-card">
        <div className="teacher-login-header">
          <div className="teacher-login-logo">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Acadify
          </div>

          <p className="teacher-login-subtitle">
            Faculty &amp; Admin Portal
          </p>

          <span className="teacher-login-role-badge">
            Staff Access
          </span>
        </div>

        {error && (
          <div className="teacher-login-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="teacher-login-form-group">
            <label htmlFor="teacher-email">
              Email Address
            </label>

            <input
              type="email"
              id="teacher-email"
              name="email"
              placeholder="your.email@acadify.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className="teacher-login-form-group">
            <label htmlFor="teacher-password">
              Password
            </label>

            <input
              type="password"
              id="teacher-password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="teacher-login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="teacher-login-divider" />

        <div className="teacher-login-footer-links">
          <p>
            <Link to="/forgot-password">
              Forgot your password?
            </Link>
          </p>
        </div>

        <div className="teacher-login-back-home">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;
