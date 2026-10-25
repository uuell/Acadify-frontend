
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: UserRole;
}

const loginRoutes: Record<UserRole, string> = {
  student: "/student-login",
  teacher: "/teacher-login",
  admin: "/admin-login",
};

function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const { user, authenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  // Redirect unauthenticated users to the correct login page
  if (!authenticated || !user) {
    return <Navigate to={loginRoutes[allowedRole]} replace />;
  }

  // Prevent users from accessing another role's portal
  if (user.role !== allowedRole) {
    return <Navigate to={loginRoutes[allowedRole]} replace />;
  }

  return children;
}

export default ProtectedRoute;
