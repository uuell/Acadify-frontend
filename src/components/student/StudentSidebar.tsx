import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import StudentNavIcon from "./StudentNavIcon";

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


function StudentSidebar({
  isOpen,
  onClose,
}: StudentSidebarProps) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError(null);

    try {
      await api.post("/auth/logout");

      await refreshUser();

      onClose();

      navigate("/student/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);

      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav
      className={`student-sidebar ${isOpen ? "sidebar-open" : ""}`}
      onClick={(event) => {
        const target = event.target;

        if (
          target instanceof Element &&
          target.closest("a.student-nav-item")
        ) {
          onClose();
        }
      }}
    >
      <div className="student-sidebar-logo">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            strokeWidth="2"
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeWidth="2"
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
        <span>Acadify</span>
      </div>

      <div className="student-nav-group">
        <span className="student-nav-label">General</span>

        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            `student-nav-item ${isActive ? "active" : ""}`
          }
        >
          <StudentNavIcon>
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
          </StudentNavIcon>

          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/student/classes"
          className={({ isActive }) =>
            `student-nav-item ${isActive ? "active" : ""}`
          }
        >
          <StudentNavIcon>
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </StudentNavIcon>
          <span>My Classes</span>
        </NavLink>

        <NavLink
          to="/student/grades"
          className={({ isActive }) =>
            `student-nav-item ${isActive ? "active" : ""}`
          }
        >
          <StudentNavIcon>
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </StudentNavIcon>
          <span>My Grades</span>
        </NavLink>
      </div>

      <div className="student-nav-group">
        <span className="student-nav-label">Tools</span>

        <NavLink
          to="/student/gpa-calculator"
          className={({ isActive }) =>
            `student-nav-item ${isActive ? "active" : ""}`
          }
        >
          <StudentNavIcon>
            <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </StudentNavIcon>
          <span>GPA Calculator</span>
        </NavLink>

        <NavLink
          to="/student/profile"
          className={({ isActive }) =>
            `student-nav-item ${isActive ? "active" : ""}`
          }
        >
          <StudentNavIcon>
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </StudentNavIcon>
          <span>Profile</span>
        </NavLink>
      </div>

      <button
        type="button"
        className="student-nav-item student-logout-btn"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        <StudentNavIcon>
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </StudentNavIcon>

        <span>{loggingOut ? "Logging out..." : "Logout"}</span>
      </button>

      {logoutError && (
        <p className="student-logout-error" role="alert">
          {logoutError}
        </p>
      )}
    </nav>
  );
}

export default StudentSidebar;