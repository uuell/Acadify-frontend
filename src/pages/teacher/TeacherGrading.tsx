import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import axios from "axios";
import api from "../../api/axios";
import type { TeacherGradingResponse } from "../../types/teacherGrading";
import "./TeacherGrading.css";

import GradingTable from "../../components/teacher/grading/GradingTable";
import ScoreEntryModal from "../../components/teacher/grading/ScoreEntryModal";
import CreateTestModal from "../../components/teacher/grading/CreateTestModal";
import GradingExportDropdown from "../../components/teacher/grading/GradingExportDropdown";

function TeacherGrading() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [data, setData] = useState<TeacherGradingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const classId = searchParams.get("class_id");
    const year = searchParams.get("year");
    const semester = searchParams.get("semester");

    const [customYear, setCustomYear] = useState("");

    const [selectedScore, setSelectedScore] = useState<{
        studentId: number;
        testId: number;
    } | null>(null);

    const [saving, setSaving] = useState(false);

    const [showCreateTestModal, setShowCreateTestModal] = useState(false);
    const [creatingTest, setCreatingTest] = useState(false);
    const [deletingTestId, setDeletingTestId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const selectedStudent = data?.grading.students.find(
        (row) => row.student.id === selectedScore?.studentId
    );

    const selectedTest = data?.grading.tests.find(
        (test) => test.id === selectedScore?.testId
    );

    const existingScore = selectedScore
        ? selectedStudent?.test_grades[String(selectedScore.testId)]
        : null;

    function updateFilters(updates: Record<string, string | null>) {
        const nextParams = new URLSearchParams(searchParams);

        for (const [key, value] of Object.entries(updates)) {
            if (value === null) {
                nextParams.delete(key);
            } else {
                nextParams.set(key, value);
            }
        }

        setSearchParams(nextParams);
    }

    function handleYearChange(year: string) {
        updateFilters({ year, class_id: null });
    }

    function handleSemesterChange(semester: string) {
        updateFilters({ semester, class_id: null });
    }

    function handleClassChange(classId: string) {
        updateFilters({ class_id: classId || null });
    }

    function handleJumpToYear() {
        const year = customYear.trim();
        const match = /^(\d{4})-(\d{4})$/.exec(year);

        if (!match || Number(match[2]) !== Number(match[1]) + 1) {
            window.alert("Please enter a valid consecutive academic year, e.g. 2025-2026.");
            return;
        }

        updateFilters({ year, class_id: null });
    }

    useEffect(() => {
        const controller = new AbortController();

        async function fetchGrading() {
            try {
                const response = await api.get<TeacherGradingResponse>(
                    "/teacher/grading",
                    {
                        params: {
                            ...(classId ? { class_id: classId } : {}),
                            ...(year ? { year } : {}),
                            ...(semester ? { semester } : {}),
                        },
                        signal: controller.signal,
                    },
                );

                if (controller.signal.aborted) return;

                if (!response.data.success) {
                    throw new Error("Failed to load grading data.");
                }

                setData(response.data);
            } catch (err) {
                if (controller.signal.aborted) return;

                console.error("Failed to load grading data:", err);
                setError("Unable to load grading data.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchGrading();

        return () => controller.abort();
    }, [classId, year, semester]);

    async function handleSaveScore(rawScore: number) {
        if (!selectedScore || saving) return;

        try {
            setSaving(true);

            await api.post("/teacher/grading/update", {
                student_id: selectedScore.studentId,
                test_id: selectedScore.testId,
                raw_score: rawScore,
            });

            const response = await api.get<TeacherGradingResponse>(
                "/teacher/grading",
                {
                    params: {
                        ...(classId ? { class_id: classId } : {}),
                        ...(year ? { year } : {}),
                        ...(semester ? { semester } : {}),
                    },
                }
            );

            if (!response.data.success) {
                throw new Error("Failed to refresh grading data.");
            }

            setData(response.data);
            setSelectedScore(null);
        } catch (error) {
            console.error("Failed to save score:", error);
            window.alert("Unable to save or refresh the score. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleCreateTest(testData: {
        title: string;
        term_tag: string;
        component_tag: string;
        max_score: number;
    }) {
        if (!data?.selected_class || creatingTest) return;

        try {
            setCreatingTest(true);

            await api.post("/teacher/grading/create-test", {
                class_id: data.selected_class.id,
                ...testData,
            });

            const response = await api.get<TeacherGradingResponse>(
                "/teacher/grading",
                {
                    params: {
                        ...(classId ? { class_id: classId } : {}),
                        ...(year ? { year } : {}),
                        ...(semester ? { semester } : {}),
                    },
                }
            );

            if (!response.data.success) {
                throw new Error("Failed to refresh grading data.");
            }

            setData(response.data);
            setShowCreateTestModal(false);
        } catch (error) {
            console.error("Failed to create activity:", error);
            window.alert(
                "Unable to create or refresh the activity. Please check the grading table before trying again."
            );
        } finally {
            setCreatingTest(false);
        }
    }

    async function handleDeleteTest(testId: number) {
        if (deletingTestId !== null || saving || creatingTest) return;

        try {
            setDeletingTestId(testId);
            setDeleteError(null);

            await api.post("/teacher/grading/delete-test", {
                test_id: testId,
            });

            const response = await api.get<TeacherGradingResponse>(
                "/teacher/grading",
                {
                    params: {
                        ...(classId ? { class_id: classId } : {}),
                        ...(year ? { year } : {}),
                        ...(semester ? { semester } : {}),
                    },
                }
            );

            if (!response.data.success) {
                throw new Error("The activity was deleted, but the grading table could not be refreshed.");
            }

            setData(response.data);
        } catch (error) {
            console.error("Failed to delete activity:", error);

            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)?.message
                : error instanceof Error
                    ? error.message
                    : undefined;

            setDeleteError(message ?? "Unable to delete the activity. Please try again.");
        } finally {
            setDeletingTestId(null);
        }
    }

    async function handleExportGrades(format: "csv" | "xlsx") {
        if (!data?.selected_class) return;

        try {
            const response = await api.get("/teacher/grading/export", {
                params: {
                    class_id: data.selected_class.id,
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
            link.download = `grades_${data.selected_class.subject_code}.${format}`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export grades:", error);
            window.alert("Unable to export grades. Please try again.");
        }
    }

    if (loading) {
        return <p>Loading grading data...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }

    if (!data) {
        return <p>No grading data available.</p>;
    }

    return (
        <div className="teacher-grading-page">
            <header className="teacher-grading-toolbar">
                <div className="teacher-grading-selectors">
                    <div className="teacher-grading-selector-group">
                        <label htmlFor="gradingSemester">Semester</label>
                        <select
                            id="gradingSemester"
                            value={data.filters.selected_semester}
                            onChange={(e) => handleSemesterChange(e.target.value)}
                        >
                            <option value="all">All Semesters</option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>

                    <div className="teacher-grading-selector-group">
                        <label htmlFor="gradingYear">Year</label>
                        <select
                            id="gradingYear"
                            value={data.filters.selected_year}
                            onChange={(e) => handleYearChange(e.target.value)}
                        >
                            <option value="all">All Years</option>
                            {data.filters.available_years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                            {!data.filters.available_years.includes(data.filters.selected_year) &&
                                data.filters.selected_year !== "all" && (
                                    <option value={data.filters.selected_year}>
                                        {data.filters.selected_year}
                                    </option>
                                )}
                        </select>
                    </div>

                    <div className="teacher-grading-selector-group">
                        <label htmlFor="gradingCustomYear">Jump to Year</label>
                        <div className="teacher-grading-jump-row">
                            <input
                                id="gradingCustomYear"
                                type="text"
                                placeholder="YYYY-YYYY"
                                value={customYear}
                                onChange={(e) => setCustomYear(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleJumpToYear();
                                }}
                            />
                            <button type="button" onClick={handleJumpToYear}>
                                Go
                            </button>
                        </div>
                    </div>

                    <div className="teacher-grading-selector-group teacher-grading-class-group">
                        <label htmlFor="gradingClass">Class</label>
                        <select
                            id="gradingClass"
                            value={data.selected_class?.id ?? ""}
                            onChange={(e) => handleClassChange(e.target.value)}
                            disabled={data.classes.length === 0}
                        >
                            {data.classes.length === 0 ? (
                                <option value="">No classes available</option>
                            ) : (
                                data.classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.subject_code} - {cls.subject_name} (Sec {cls.section})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                <div className="teacher-grading-actions">
                    <button
                        type="button"
                        onClick={() => setShowCreateTestModal(true)}
                        disabled={!data?.selected_class}
                    >
                        Add Test / Quiz
                    </button>
                    {data.selected_class && (
                        <GradingExportDropdown
                            classId={data.selected_class.id}
                            onExport={handleExportGrades}
                        />
                    )}
                </div>
            </header>

            <div className="teacher-grading-content">
                {data.selected_class ? (
                    <GradingTable
                        grading={data.grading}
                        onDeleteTest={handleDeleteTest}
                        deletingTestId={deletingTestId}
                        onScoreClick={(studentId, testId) => {
                            setSelectedScore({ studentId, testId });
                        }}
                    />
                ) : (
                    <div className="teacher-grading-empty">
                        <h3>No Class Selected</h3>
                        <p>Select a class from the dropdown above to start grading.</p>
                    </div>
                )}
                {selectedScore && selectedStudent && selectedTest && (
                    <ScoreEntryModal
                        key={`${selectedScore.studentId}-${selectedScore.testId}`}
                        studentName={`${selectedStudent.student.first_name} ${selectedStudent.student.last_name}`}
                        testTitle={selectedTest.title}
                        initialRawScore={existingScore?.raw_score ?? null}
                        maxScore={selectedTest.max_score}
                        saving={saving}
                        onClose={() => setSelectedScore(null)}
                        onSave={handleSaveScore}
                    />
                )}

                {showCreateTestModal && data?.selected_class && (
                    <CreateTestModal
                        components={data.grading.components.map((name) => ({ name }))}
                        onClose={() => setShowCreateTestModal(false)}
                        onSave={handleCreateTest}
                        saving={creatingTest}
                    />
                )}
            </div>

            {deleteError && createPortal(
                <div
                    className="grading-modal-overlay"
                    onClick={() => setDeleteError(null)}
                >
                    <div
                        className="grading-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-error-title"
                        aria-describedby="delete-error-message"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grading-modal-header">
                            <h2 id="delete-error-title">Unable to Delete Activity</h2>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setDeleteError(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="grading-modal-body">
                            <p id="delete-error-message">{deleteError}</p>
                        </div>
                        <div className="grading-modal-footer">
                            <button
                                type="button"
                                className="grading-modal-save"
                                onClick={() => setDeleteError(null)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default TeacherGrading;