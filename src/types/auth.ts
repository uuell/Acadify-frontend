export type UserRole = "student" | "teacher" | "admin";

export interface AuthUser {
  id: number;
  role: UserRole;

  first_name?: string;
  last_name?: string;
  email?: string;

  student_number?: string;
  employee_number?: string;
}

export interface AuthMeResponse {
  success: boolean;
  authenticated: boolean;
  user: AuthUser | null;
}