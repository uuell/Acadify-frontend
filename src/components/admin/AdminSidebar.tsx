
import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

import "./AdminSidebar.css";

interface AdminSidebarProps {
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
      className="admin-sidebar-icon"
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
        `admin-sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <SidebarIcon>{icon}</SidebarIcon>
      <span>{children}</span>
    </NavLink>
  );
}

function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
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
      navigate("/admin-login", { replace: true });
    } catch (error) {
      console.error("Admin logout failed:", error);

      if (axios.isAxiosError(error)) {
        setLogoutError(
          error.response?.data?.message ||
          "Unable to log out. Please try again.",
        );
      } else {
        setLogoutError(
          "Unable to log out. Please try again.",
        );
      }
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside
      id="admin-sidebar"
      className={`admin-sidebar ${isOpen ? "open" : ""}`}
      aria-label="Admin sidebar"
    >
      {/* Acadify Logo */}
      <div className="admin-sidebar-logo">
        <SidebarIcon>
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </SidebarIcon>

        <span>Acadify</span>
      </div>

      {/* Management Navigation */}
      <nav
        className="admin-sidebar-navigation"
        aria-label="Admin navigation"
      >
        <div className="admin-sidebar-group">
          <span className="admin-sidebar-label">
            Management
          </span>

          <SidebarLink
            to="/admin/dashboard"
            onClose={onClose}
            icon={
              <>
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                />
              </>
            }
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            to="/admin/users"
            onClose={onClose}
            icon={
              <>
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </>
            }
          >
            User Management
          </SidebarLink>

          <SidebarLink
            to="/admin/progression"
            onClose={onClose}
            icon={
              <>
                <path d="M4 19h16" />
                <path d="M6 16l5-5 3 3 5-7" />
                <path d="M15 7h4v4" />
              </>
            }
          >
            Progression Checker
          </SidebarLink>
        </div>

        {/* System Navigation */}
        <div className="admin-sidebar-group">
          <span className="admin-sidebar-label">
            System
          </span>

          <SidebarLink
            to="/admin/settings"
            onClose={onClose}
            icon={
              <>
                <path d="M12 15a3 3 0 110-6 3 3 0 010 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06-2 2-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21h-2.82v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06-2-2 .06-.06A1.65 1.65 0 007.6 15a1.65 1.65 0 00-1.51-1H6v-2.82h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06 2-2 .06.06a1.65 1.65 0 001.82.33 1.65 1.65 0 001-1.51V5h2.82v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06 2 2-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21V14h-.09a1.65 1.65 0 00-1.51 1z" />
              </>
            }
          >
            System Settings
          </SidebarLink>
        </div>
      </nav>

      {/* Logout */}
      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-sidebar-logout"
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
          <p className="admin-sidebar-error" role="alert">
            {logoutError}
          </p>
        )}
      </div>
    </aside>
  );
}

export default AdminSidebar;
