
import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

import "./TeacherSidebar.css";

interface TeacherSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarLinkProps {
  to: string;
  children: ReactNode;
  icon: ReactNode;
  onClose: () => void;
}

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="teacher-sidebar-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SidebarLink({
  to,
  children,
  icon,
  onClose,
}: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `teacher-sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <SidebarIcon>{icon}</SidebarIcon>
      <span>{children}</span>
    </NavLink>
  );
}

function TeacherSidebar({
  isOpen,
  onClose,
}: TeacherSidebarProps) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await api.post("/auth/logout");
      await refreshUser();

      onClose();
      navigate("/teacher-login", { replace: true });
    } catch (error) {
      console.error("Teacher logout failed:", error);

      if (axios.isAxiosError(error)) {
        setLogoutError(
          error.response?.data?.message ||
            "Unable to log out. Please try again.",
        );
      } else {
        setLogoutError("Unable to log out. Please try again.");
      }
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside
      className={`teacher-sidebar ${isOpen ? "open" : ""}`}
      aria-label="Teacher sidebar"
    >
      {/* Acadify Logo */}
      <div className="teacher-sidebar-logo">
        <SidebarIcon>
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </SidebarIcon>

        <span>Acadify</span>
      </div>

      {/* Management */}
      <nav
        className="teacher-sidebar-navigation"
        aria-label="Teacher navigation"
      >
        <div className="teacher-sidebar-group">
          <span className="teacher-sidebar-label">
            Management
          </span>

          <SidebarLink
            to="/teacher/dashboard"
            onClose={onClose}
            icon={
              <>
                <path d="M3 12l2-2 7-7 7 7" />
                <path d="M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
              </>
            }
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            to="/teacher/classes"
            onClose={onClose}
            icon={
              <>
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
                <path d="M19 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </>
            }
          >
            Classes
          </SidebarLink>

          <SidebarLink
            to="/teacher/grading"
            onClose={onClose}
            icon={
              <>
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                <path d="M18.586 3.586a2 2 0 012.828 2.828L11.828 16H9v-2.828l9.586-9.586z" />
              </>
            }
          >
            Grading
          </SidebarLink>
        </div>

        {/* AI Tools */}
        <div className="teacher-sidebar-group">
          <span className="teacher-sidebar-label">
            AI Tools
          </span>

          <SidebarLink
            to="/teacher/ai-grading"
            onClose={onClose}
            icon={
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            }
          >
            AI Grading
          </SidebarLink>
        </div>

        {/* Insights */}
        <div className="teacher-sidebar-group">
          <span className="teacher-sidebar-label">
            Insights
          </span>

          <SidebarLink
            to="/teacher/profile"
            onClose={onClose}
            icon={
              <>
                <path d="M12 15a3 3 0 110-6 3 3 0 010 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06-2 2-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21h-2.82v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06-2-2 .06-.06A1.65 1.65 0 007.6 15a1.65 1.65 0 00-1.51-1H6v-2.82h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06 2-2 .06.06a1.65 1.65 0 001.82.33 1.65 1.65 0 001-1.51V5h2.82v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06 2 2-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21V14h-.09a1.65 1.65 0 00-1.51 1z" />
              </>
            }
          >
            Profile
          </SidebarLink>
        </div>
      </nav>

      {/* Logout */}
      <div className="teacher-sidebar-footer">
        <button
          type="button"
          className="teacher-sidebar-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <SidebarIcon>
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </SidebarIcon>

          <span>
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>

        {logoutError && (
          <p className="teacher-sidebar-error" role="alert">
            {logoutError}
          </p>
        )}
      </div>
    </aside>
  );
}

export default TeacherSidebar;
