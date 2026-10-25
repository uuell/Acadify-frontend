import { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axios";
import "./ProgressionChecker.css";

interface ProgressionSubject {
    class_id: number;
    subject_code: string;
    subject_name: string;
    semester: string;
    enrollment_status: string;
    final_grade: number | null;
    result: string;
}

interface ProgressionStudent {
    student_id: number;
    student_number: string;
    student_name: string;
    school_year: string;
    current_year_level: string;
    academic_status: string;
    enrollment_classification: string;
    eligible: boolean;
    reasons: string[];
    subjects: ProgressionSubject[];
}

interface ProgressionCheckResponse {
    success: boolean;
    data: ProgressionStudent[];
    summary?: {
        eligible: number;
        ineligible: number;
    };
}

interface BatchPromotionResponse {
    success: boolean;
    message: string;
    summary: {
        requested: number;
        promoted: number;
        rejected: number;
    };
    rejected: {
        student_id: number;
        reasons: string[];
    }[];
}

export default function ProgressionChecker() {
    const [students, setStudents] = useState<ProgressionStudent[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "eligible" | "ineligible">(
        "all"
    );

    const loadStudents = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get<ProgressionCheckResponse>(
                "/admin/progression/check"
            );

            setStudents(response.data.data);
            setSelectedIds([]);
            setExpandedStudentId(null);
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to load students."
                    : "An unexpected error occurred."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function fetchInitialStudents() {
            try {
                const response = await api.get<ProgressionCheckResponse>(
                    "/admin/progression/check"
                );

                if (!cancelled) {
                    setStudents(response.data.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        axios.isAxiosError(err)
                            ? err.response?.data?.message || "Failed to load students."
                            : "An unexpected error occurred."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchInitialStudents();

        return () => {
            cancelled = true;
        };
    }, []);

    const eligibleCount = students.filter((student) => student.eligible).length;
    const ineligibleCount = students.length - eligibleCount;

    const filteredStudents = students.filter((student) => {
        const query = search.toLowerCase().trim();

        const matchesSearch =
            student.student_name.toLowerCase().includes(query) ||
            student.student_number.toLowerCase().includes(query);

        const matchesFilter =
            filter === "all" ||
            (filter === "eligible" && student.eligible) ||
            (filter === "ineligible" && !student.eligible);

        return matchesSearch && matchesFilter;
    });

    function toggleSelection(studentId: number) {
        setSelectedIds((previous) =>
            previous.includes(studentId)
                ? previous.filter((id) => id !== studentId)
                : [...previous, studentId]
        );
    }

    async function promoteStudent(student: ProgressionStudent) {
        if (!student.eligible || submitting) return;

        const confirmed = window.confirm(
            `Promote ${student.student_name} from ${student.current_year_level} to the next year level?`
        );

        if (!confirmed) return;

        setSubmitting(true);
        setError("");
        setMessage("");

        try {
            await api.post(`/admin/progression/promote/${student.student_id}`, {
                confirm_promotion: true,
            });

            await loadStudents();
            setMessage(`${student.student_name} was successfully promoted.`);
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Promotion failed."
                    : "An unexpected error occurred."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function promoteSelected() {
        if (selectedIds.length === 0 || submitting) return;

        const confirmed = window.confirm(
            `Promote ${selectedIds.length} selected student(s)? Only eligible students will be promoted.`
        );

        if (!confirmed) return;

        setSubmitting(true);
        setError("");
        setMessage("");

        try {
            const response = await api.post<BatchPromotionResponse>(
                "/admin/progression/promote/batch",
                {
                    student_ids: selectedIds,
                    confirm_promotion: true,
                }
            );

            const { promoted, rejected } = response.data.summary;

            await loadStudents();

            setMessage(
                `Batch processed: ${promoted} promoted, ${rejected} rejected.`
            );
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Batch promotion failed."
                    : "An unexpected error occurred."
            );
        } finally {
            setSubmitting(false);
        }
    }

    function toggleAllEligible() {
        const eligibleIds = filteredStudents
            .filter((student) => student.eligible)
            .map((student) => student.student_id);

        const allSelected = eligibleIds.every((id) =>
            selectedIds.includes(id)
        );

        if (allSelected) {
            setSelectedIds((previous) =>
                previous.filter((id) => !eligibleIds.includes(id))
            );
        } else {
            setSelectedIds((previous) => [
                ...new Set([...previous, ...eligibleIds]),
            ]);
        }
    }


    return (
        <div className="progression-page">
            <header className="progression-header">
                <div>
                    <h1>Manual Progression Checker</h1>
                    <p>
                        Review student eligibility and manually approve academic progression.
                    </p>
                </div>
            </header>

            <section className="progression-stats">
                <div className="progression-stat-card">
                    <span>Total Students</span>
                    <strong>{students.length}</strong>
                </div>

                <div className="progression-stat-card eligible">
                    <span>Eligible Students</span>
                    <strong>{eligibleCount}</strong>
                </div>

                <div className="progression-stat-card ineligible">
                    <span>Ineligible Students</span>
                    <strong>{ineligibleCount}</strong>
                </div>

                <div className="progression-stat-card selected">
                    <span>Selected Students</span>
                    <strong>{selectedIds.length}</strong>
                </div>
            </section>

            {error && (
                <div className="progression-alert progression-alert-error" role="alert">
                    {error}
                </div>
            )}

            {message && (
                <div className="progression-alert progression-alert-success" role="status">
                    {message}
                </div>
            )}

            <section className="progression-toolbar">
                <input
                    className="progression-search"
                    type="search"
                    placeholder="Search by name or student number..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search students"
                    name="progression-search"
                />

                <select
                    className="progression-filter"
                    value={filter}
                    onChange={(event) =>
                        setFilter(event.target.value as "all" | "eligible" | "ineligible")
                    }
                    aria-label="Filter eligibility"
                    name="progression-filter"
                >
                    <option value="all">All Students</option>
                    <option value="eligible">Eligible</option>
                    <option value="ineligible">Ineligible</option>
                </select>

                <button
                    type="button"
                    className="progression-btn progression-btn-secondary"
                    onClick={() => void loadStudents()}
                    disabled={loading || submitting}
                >
                    Refresh
                </button>

                <button
                    type="button"
                    className="progression-btn progression-btn-primary"
                    onClick={() => void promoteSelected()}
                    disabled={selectedIds.length === 0 || submitting}
                >
                    {submitting
                        ? "Processing..."
                        : `Promote Selected (${selectedIds.length})`}
                </button>
            </section>

            {loading ? (
                <div className="progression-loading">
                    Loading student progression data...
                </div>
            ) : (
                <div className="progression-table-container">
                    <table className="progression-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        aria-label="Select all eligible students"
                                        name="select-all-eligible"
                                        onChange={toggleAllEligible}
                                        checked={
                                            filteredStudents.some((student) => student.eligible) &&
                                            filteredStudents
                                                .filter((student) => student.eligible)
                                                .every((student) =>
                                                    selectedIds.includes(student.student_id)
                                                )
                                        }
                                    />
                                </th>
                                <th>Student Number</th>
                                <th>Student Name</th>
                                <th>Year Level</th>
                                <th>Academic Status</th>
                                <th>Classification</th>
                                <th>Eligibility</th>
                                <th>Details</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.map((student) => {
                                const expanded = expandedStudentId === student.student_id;

                                return (
                                    <Fragment key={student.student_id}>
                                        <tr>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name={`select-student-${student.student_id}`}
                                                    aria-label={`Select ${student.student_name}`}
                                                    checked={selectedIds.includes(student.student_id)}
                                                    disabled={!student.eligible || submitting}
                                                    onChange={() => toggleSelection(student.student_id)}
                                                />
                                            </td>
                                            <td className="progression-student-number">{student.student_number}</td>
                                            <td className="progression-student-name">{student.student_name}</td>
                                            <td>{student.current_year_level}</td>
                                            <td>{student.academic_status}</td>
                                            <td>{student.enrollment_classification}</td>
                                            <td>
                                                <span className={`progression-status ${student.eligible
                                                    ? "progression-status-eligible"
                                                    : "progression-status-ineligible"}`}>
                                                    {student.eligible ? "Eligible" : "Ineligible"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="progression-btn progression-btn-secondary progression-details-button"
                                                    aria-expanded={expanded}
                                                    aria-controls={`progression-details-${student.student_id}`}
                                                    onClick={() => setExpandedStudentId(expanded ? null : student.student_id)}
                                                >
                                                    {expanded ? "Hide Details" : "View Details"}
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="progression-btn progression-btn-primary"
                                                    disabled={!student.eligible || submitting}
                                                    onClick={() => void promoteStudent(student)}
                                                >
                                                    Promote
                                                </button>
                                            </td>
                                        </tr>
                                        {expanded && (
                                            <tr className="progression-expanded-row" id={`progression-details-${student.student_id}`}>
                                                <td colSpan={9}>
                                                    <div className="progression-details-panel">
                                                        <div className="progression-details-heading">
                                                            <div>
                                                                <h3>{student.student_name}</h3>
                                                                <p>{student.student_number} · {student.school_year} · {student.current_year_level}</p>
                                                            </div>
                                                        </div>
                                                        <div className="progression-details-grid">
                                                            <section className="progression-details-section">
                                                                <h4>Eligibility Review</h4>
                                                                {student.reasons.length > 0 ? (
                                                                    <ul className="progression-reason-list">
                                                                        {student.reasons.map((reason, index) => (
                                                                            <li key={`${student.student_id}-reason-${index}`}>{reason}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="progression-no-issues">No eligibility issues found.</p>
                                                                )}
                                                            </section>
                                                            <section className="progression-details-section">
                                                                <h4>Subject Records</h4>
                                                                {student.subjects.length === 0 ? (
                                                                    <p className="progression-no-issues">No subject records available for this review.</p>
                                                                ) : (
                                                                    <div className="progression-subject-table-wrapper">
                                                                        <table className="progression-subject-table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Subject</th>
                                                                                    <th>Semester</th>
                                                                                    <th>Enrollment</th>
                                                                                    <th>Final Grade</th>
                                                                                    <th>Result</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {student.subjects.map((subject) => (
                                                                                    <tr key={subject.class_id}>
                                                                                        <td>
                                                                                            <strong>{subject.subject_code}</strong>
                                                                                            <span>{subject.subject_name}</span>
                                                                                        </td>
                                                                                        <td>{subject.semester}</td>
                                                                                        <td>{subject.enrollment_status}</td>
                                                                                        <td>{subject.final_grade ?? "—"}</td>
                                                                                        <td>{subject.result}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                            </section>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={9}>
                                        <div className="progression-empty">
                                            No students found.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

}