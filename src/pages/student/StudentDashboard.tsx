import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

import api from "../../api/axios";
import type { StudentDashboardResponse } from "../../types/student";

import AcademicOverview from "../../components/student/AcademicOverview";
import QuickStats from "../../components/student/QuickStats";
import EnrolledClasses from "../../components/student/EnrolledClasses";
import RecentGrades from "../../components/student/RecentGrades";

import "./StudentDashboard.css";

function StudentDashboard() {
  const [schoolYear, setSchoolYear] = useState("");
  const [semester, setSemester] = useState("");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<StudentDashboardResponse | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchDashboard() {
      setDashboardLoading(true);
      setDashboardError(null);

      try {
        const response = await api.get<StudentDashboardResponse>(
          "/student/dashboard",
          {
            params: {
              year: schoolYear || undefined,
              semester: semester || undefined,
            },
          }
        );

        if (active) {
          setDashboardData(response.data);
        }
      } catch (error) {
        if (active) {
          console.error("Dashboard API error:", error);

          setDashboardError("Failed to load dashboard data.");
          setDashboardData(null);
        }
      } finally {
        if (active) {
          setDashboardLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      active = false;
    };
  }, [schoolYear, semester]);

  const { user } = useAuth();

  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ") || "Student";

  const initials = [user?.first_name?.[0], user?.last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "ST";

  return (
    <div className="student-dashboard">
      <header className="student-dashboard-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>
            Welcome back! Here's an overview of your academic
            performance.
          </p>
        </div>

        <div className="student-dashboard-profile">
          <div className="student-dashboard-avatar">
            {initials}
          </div>

          <div className="student-dashboard-profile-info">
            <strong>{fullName}</strong>
            <span>{user?.student_number ?? "—"}</span>
          </div>
        </div>
      </header>

      <section className="student-dashboard-filters">
        <div className="student-filter-group">
          <label htmlFor="school-year">School Year</label>

          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
          >
            <option value="">
              {dashboardData?.period.current_school_year ?? "Current School Year"}
            </option>

            {dashboardData?.available_years
              .filter(
                (year) => year !== dashboardData.period.current_school_year
              )
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>

        <div className="student-filter-group">
          <label htmlFor="semester">Semester</label>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">
              {dashboardData?.period.current_semester ?? "Current Semester"}
            </option>

            {["1st Semester", "2nd Semester"]
              .filter(
                (value) => value !== dashboardData?.period.current_semester
              )
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      </section>

      {dashboardLoading ? (
        <div className="student-dashboard-feedback">
          <p>Loading dashboard data...</p>
        </div>
      ) : dashboardError ? (
        <div
          className="student-dashboard-feedback student-dashboard-error"
          role="alert"
        >
          <p>{dashboardError}</p>
        </div>
      ) : dashboardData ? (
        <>
          <AcademicOverview gpa={dashboardData.gpa} />

          <QuickStats
            stats={dashboardData.stats}
            academicStanding={dashboardData.academic_standing}
          />

          <EnrolledClasses
            classes={dashboardData.enrolled_classes}
            enrollmentMap={dashboardData.enrollment_map}
          />

          <RecentGrades grades={dashboardData.recent_grades} />
        </>
      ) : null}
    </div>
  );
}

export default StudentDashboard;