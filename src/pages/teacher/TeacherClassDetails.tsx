import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/axios";

import type {
    TeacherClassDetailsData,
    TeacherClassDetailsResponse,
    TeacherClassStudent,
} from "../../types/teacherClassDetails";
import type {
    TeacherEnrolledStudentsResponse,
} from "../../types/teacherStudents";

import "./TeacherClassDetails.css";

function TeacherClassDetails() {
    const { classId } = useParams<{ classId: string }>();

    const [classData, setClassData] =
        useState<TeacherClassDetailsData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [students, setStudents] = useState<TeacherClassStudent[]>([]);
    const [studentProfiles, setStudentProfiles] = useState<
        TeacherEnrolledStudentsResponse["students"]
    >([]);

    const [exportOpen, setExportOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const enrolledCount = students.length;

    const gradedCount = students.filter(
        (student) => student.enrollment.final_grade !== null
    ).length;

    const pendingCount = enrolledCount - gradedCount;

    useEffect(() => {
        if (!classId || !/^\d+$/.test(classId) || Number(classId) <= 0) {
            return;
        }

        const controller = new AbortController();

        async function fetchClassDetails() {
            try {
                // REQUIRED: Load class information and student grades
                const response = await api.get<TeacherClassDetailsResponse>(
                    `/teacher/classes/${classId}`,
                    {
                        signal: controller.signal,
                    },
                );

                if (!response.data.success) {
                    throw new Error("Failed to load class details.");
                }

                if (controller.signal.aborted) return;

                setClassData(response.data.class);
                setStudents(response.data.students);

                // OPTIONAL: Load additional student profile information
                try {
                    const rosterResponse =
                        await api.get<TeacherEnrolledStudentsResponse>(
                            `/teacher/classes/${classId}/enrolled-students`,
                            {
                                signal: controller.signal,
                            },
                        );

                    if (controller.signal.aborted) return;

                    if (rosterResponse.data.success) {
                        setStudentProfiles(rosterResponse.data.students);
                    } else {
                        console.warn("Student profiles could not be loaded.");
                    }
                } catch (profileError) {
                    if (controller.signal.aborted) return;

                    console.warn(
                        "Failed to load additional student information:",
                        profileError,
                    );
                }
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error("Failed to load class details:", error);
                setError("Unable to load class details.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchClassDetails();

        return () => controller.abort();
    }, [classId]);

    if (!classId || !/^\d+$/.test(classId) || Number(classId) <= 0) {
        return <p role="alert">Invalid class ID.</p>;
    }

    if (loading) {
        return <p>Loading class details...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }

    if (!classData) {
        return <p>Class not found.</p>;
    }

    async function handleExport(format: "csv" | "xlsx") {
        if (!classData || exporting) return;

        setExportOpen(false);
        setExporting(true);

        try {
            const response = await api.get("/teacher/grading/export", {
                params: {
                    class_id: classData.id,
                    format,
                },
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type:
                    format === "csv"
                        ? "text/csv"
                        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `grades_${classData.subject_code}.${format}`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export grades:", error);
            window.alert("Unable to export grades. Please try again.");
        } finally {
            setExporting(false);
        }
    }

    return (
        <div className="teacher-class-details">
            <header className="teacher-details-header">
                <nav className="teacher-details-breadcrumb">
                    <Link to="/teacher/dashboard">Dashboard</Link>
                    <span>›</span>
                    <Link to="/teacher/classes">Classes</Link>
                    <span>›</span>
                    <span>{classData.subject_code}</span>
                </nav>

                <div className="teacher-details-header-title">
                    <div>
                        <h1>{classData.subject_name}</h1>

                        <p className="teacher-details-subtitle">
                            {classData.subject_code}
                            {classData.section
                                ? ` - Section ${classData.section}`
                                : ""}
                            {" • "}
                            {classData.school_year} {classData.semester}
                        </p>
                    </div>

                    <div className="teacher-details-actions">
                        <div className="teacher-details-export">
                            <button
                                type="button"
                                onClick={() => setExportOpen((previous) => !previous)}
                                disabled={exporting}
                                aria-expanded={exportOpen}
                            >
                                {exporting ? "Exporting..." : "Export Grades ▾"}
                            </button>

                            {exportOpen && (
                                <div className="teacher-details-export-menu">
                                    <button type="button" onClick={() => void handleExport("csv")}>
                                        Export as CSV
                                    </button>

                                    <button type="button" onClick={() => void handleExport("xlsx")}>
                                        Export as Excel (.xlsx)
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link
                            to={`/teacher/grading?class_id=${classData.id}`}
                            className="teacher-details-grade-link"
                        >
                            Grade Students
                        </Link>
                    </div>
                </div>
            </header>

            <section className="teacher-details-info-grid">
                <div className="teacher-details-info-card">
                    <div className="teacher-details-info-label">
                        Enrolled Students
                    </div>

                    <div className="teacher-details-info-value">
                        {enrolledCount}
                    </div>

                    <div className="teacher-details-info-subtext">
                        {enrolledCount} / {classData.max_students} capacity
                    </div>
                </div>

                <div className="teacher-details-info-card">
                    <div className="teacher-details-info-label">
                        Units
                    </div>

                    <div className="teacher-details-info-value">
                        {classData.units}
                    </div>

                    <div className="teacher-details-info-subtext">
                        Credit hours
                    </div>
                </div>

                <div className="teacher-details-info-card">
                    <div className="teacher-details-info-label">
                        Schedule
                    </div>

                    <div className="teacher-details-info-value teacher-details-schedule">
                        {classData.schedule || "TBA"}
                    </div>

                    <div className="teacher-details-info-subtext">
                        {classData.room ? `Room ${classData.room}` : "Room TBA"}
                    </div>
                </div>

                <div className="teacher-details-info-card">
                    <div className="teacher-details-info-label">
                        Graded Students
                    </div>

                    <div className="teacher-details-info-value">
                        {gradedCount}
                    </div>

                    <div className="teacher-details-info-subtext">
                        {pendingCount} pending
                    </div>
                </div>
            </section>

            <section className="teacher-details-section">
                <div className="teacher-details-section-header">
                    <h2>Class Information</h2>
                </div>

                <div className="teacher-details-grid">
                    <div className="teacher-details-item">
                        <span className="teacher-details-label">Subject Code</span>
                        <span className="teacher-details-value">
                            {classData.subject_code}
                        </span>
                    </div>

                    <div className="teacher-details-item">
                        <span className="teacher-details-label">Subject Name</span>
                        <span className="teacher-details-value">
                            {classData.subject_name}
                        </span>
                    </div>

                    <div className="teacher-details-item">
                        <span className="teacher-details-label">School Year</span>
                        <span className="teacher-details-value">
                            {classData.school_year}
                        </span>
                    </div>

                    <div className="teacher-details-item">
                        <span className="teacher-details-label">Semester</span>
                        <span className="teacher-details-value">
                            {classData.semester}
                        </span>
                    </div>

                    <div className="teacher-details-item">
                        <span className="teacher-details-label">Section</span>
                        <span className="teacher-details-value">
                            {classData.section || "No section (Irregular)"}
                        </span>
                    </div>

                    <div className="teacher-details-item">
                        <span className="teacher-details-label">Units</span>
                        <span className="teacher-details-value">
                            {classData.units} units
                        </span>
                    </div>

                    <div className="teacher-details-item">
                        <span className="teacher-details-label">Schedule</span>
                        <span className="teacher-details-value">
                            {classData.schedule || "Not set"}
                        </span>
                    </div>

                    <div className="teacher-details-item">
                        <span className="teacher-details-label">Room</span>
                        <span className="teacher-details-value">
                            {classData.room || "Not set"}
                        </span>
                    </div>
                </div>
            </section>

            <section className="teacher-details-section">
                <div className="teacher-details-section-header">
                    <h2>Student Roster</h2>
                    <span className="teacher-details-roster-count">
                        {students.length} {students.length === 1 ? "student" : "students"}
                    </span>
                </div>

                {students.length === 0 ? (
                    <div className="teacher-details-empty">
                        <h3>No Students Enrolled</h3>
                        <p>This class has no enrolled students yet.</p>
                    </div>
                ) : (
                    <div className="teacher-details-table-wrapper">
                        <table className="teacher-details-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Program</th>
                                    <th>Year Level</th>
                                    <th>Average Grade</th>
                                    <th>Graded Activities</th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map((student) => {
                                    const profile = studentProfiles.find(
                                        (item) => item.id === student.id,
                                    );
                                    const grade = student.enrollment.final_grade;

                                    const gradeClass =
                                        grade === null
                                            ? "grade-none"
                                            : grade <= 1.5
                                                ? "grade-excellent"
                                                : grade <= 2.5
                                                    ? "grade-good"
                                                    : grade <= 3.0
                                                        ? "grade-passing"
                                                        : "grade-failing";

                                    return (
                                        <tr key={student.id}>
                                            <td>
                                                <div className="teacher-details-student">
                                                    <div className="teacher-details-avatar">
                                                        {student.first_name.charAt(0)}
                                                        {student.last_name.charAt(0)}
                                                    </div>

                                                    <div>
                                                        <div className="teacher-details-student-name">
                                                            {student.first_name} {student.last_name}
                                                        </div>
                                                        <div className="teacher-details-student-number">
                                                            {student.student_number}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{profile?.program || "—"}</td>
                                            <td>{profile?.year_level ?? "—"}</td>

                                            <td>
                                                <span className={`teacher-details-grade ${gradeClass}`}>
                                                    {grade === null
                                                        ? student.enrollment.grade_display === "INC"
                                                            ? "INC"
                                                            : "Not graded"
                                                        : student.enrollment.grade_display}
                                                </span>
                                            </td>

                                            <td>{student.graded_activities}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default TeacherClassDetails;