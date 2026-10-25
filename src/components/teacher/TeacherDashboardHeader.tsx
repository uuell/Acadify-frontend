
import { useState, type FormEvent } from "react";
import type { TeacherDashboardResponse } from "../../types/teacher";

interface TeacherDashboardHeaderProps {
    dashboard: TeacherDashboardResponse;
    onFilterChange: (year: string, semester: string) => void;
}

function TeacherDashboardHeader({
    dashboard,
    onFilterChange,
}: TeacherDashboardHeaderProps) {
    const { teacher, academic_period, filters, classes } = dashboard;

    const [customYear, setCustomYear] = useState("");
    const [yearError, setYearError] = useState("");

    function handleCustomYear(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const year = customYear.trim();
        const match = /^(\d{4})-(\d{4})$/.exec(year);

        if (!match) {
            setYearError("Use the format YYYY-YYYY.");
            return;
        }

        if (Number(match[2]) !== Number(match[1]) + 1) {
            setYearError("Academic years must be consecutive.");
            return;
        }

        setYearError("");
        onFilterChange(year, filters.selected_semester);
    }

    return (
        <header className="teacher-dashboard-header">
            <div className="teacher-dashboard-welcome">
                <h1>Welcome back, Prof. {teacher.last_name}</h1>

                <p>
                    Professor Control Center •{" "}
                    {academic_period.current_semester},{" "}
                    {academic_period.current_school_year}
                </p>
            </div>

            <div className="teacher-dashboard-filters">
                <select
                    aria-label="Semester"
                    value={filters.selected_semester}
                    onChange={(event) =>
                        onFilterChange(
                            filters.selected_year,
                            event.target.value,
                        )
                    }
                >
                    <option value="all">All Semesters</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer</option>
                </select>

                <select
                    aria-label="School year"
                    value={filters.selected_year}
                    onChange={(event) =>
                        onFilterChange(
                            event.target.value,
                            filters.selected_semester,
                        )
                    }
                >
                    <option value="all">All Years</option>

                    {!filters.available_years.includes(filters.selected_year) &&
                        filters.selected_year !== "all" && (
                            <option value={filters.selected_year}>
                                {filters.selected_year}
                            </option>
                        )}

                    {filters.available_years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>


                <div className="teacher-dashboard-custom-year-wrapper">
                    <form
                        className="teacher-dashboard-custom-year"
                        onSubmit={handleCustomYear}
                    >
                        <span>or</span>

                        <input
                            type="text"
                            value={customYear}
                            onChange={(event) => {
                                setCustomYear(event.target.value);
                                setYearError("");
                            }}
                            placeholder="YYYY-YYYY"
                            aria-label="Custom school year"
                            aria-invalid={Boolean(yearError)}
                            aria-describedby={
                                yearError ? "teacher-custom-year-error" : undefined
                            }
                        />

                        <button type="submit">Go</button>
                    </form>

                    {yearError && (
                        <p
                            id="teacher-custom-year-error"
                            className="teacher-dashboard-filter-error"
                            role="alert"
                        >
                            {yearError}
                        </p>
                    )}
                </div>


                <span className="teacher-dashboard-class-count">
                    Showing: {classes.length}{" "}
                    {classes.length === 1 ? "class" : "classes"}
                </span>

                {yearError && (
                    <p className="teacher-dashboard-filter-error" role="alert">
                        {yearError}
                    </p>
                )}
            </div>
        </header>
    );
}

export default TeacherDashboardHeader;
