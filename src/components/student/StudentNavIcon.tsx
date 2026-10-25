import type { ReactNode } from "react";

interface StudentNavIconProps {
  children: ReactNode;
}

function StudentNavIcon({ children }: StudentNavIconProps) {
  return (
    <svg
      className="student-nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default StudentNavIcon;