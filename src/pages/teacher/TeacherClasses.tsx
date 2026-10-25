
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import api from "../../api/axios";

import type { TeacherClassesResponse } from "../../types/teacherClasses";
import TeacherClassCard from "../../components/teacher/TeacherClassCard";
import TeacherClassModal from "../../components/teacher/TeacherClassModal";
import TeacherDeleteClassModal from "../../components/teacher/TeacherDeleteClassModal";

import "./TeacherClasses.css";

function TeacherClasses() {
    const [data, setData] = useState<TeacherClassesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [customYear, setCustomYear] = useState("");
    const [yearError, setYearError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [editingClassId, setEditingClassId] = useState<number | null>(null);

    const [deletingClassId, setDeletingClassId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        async function fetchClasses() {
            try {
                setLoading(true);
                setError("");

                const params: Record<string, string> = {};

                if (selectedYear !== null) {
                    params.year = selectedYear;
                }

                if (selectedSemester !== null) {
                    params.semester = selectedSemester;
                }

                const response = await api.get<TeacherClassesResponse>(
                    "/teacher/classes",
                    {
                        params,
                        signal: controller.signal,
                    },
                );

                setData(response.data);
            } catch (err) {
                if (controller.signal.aborted) return;

                if (axios.isAxiosError(err)) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load your classes.",
                    );
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchClasses();

        return () => controller.abort();
    }, [selectedYear, selectedSemester, refreshKey]);

    const filteredClasses = useMemo(() => {
        if (!data) return [];

        const query = searchQuery.trim().toLowerCase();

        if (!query) return data.classes;

        return data.classes.filter((classItem) => {
            const searchableText = [
                classItem.name,
                classItem.code,
                classItem.section,
                classItem.room ?? "",
                classItem.schedule ?? "",
                classItem.academic_period.semester,
                classItem.academic_period.school_year,
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [data, searchQuery]);

    function handleCustomYear() {
        const year = customYear.trim();
        const match = /^(\d{4})-(\d{4})$/.exec(year);

        if (!match) {
            setYearError("Use the format YYYY-YYYY.");
            return;
        }

        const startYear = Number(match[1]);
        const endYear = Number(match[2]);

        if (endYear !== startYear + 1) {
            setYearError("Academic years must be consecutive.");
            return;
        }

        setYearError("");
        setSelectedYear(year);
    }

    function handleView(classId: number) {
        navigate(`/teacher/classes/${classId}`);
    }

    function handleEdit(classId: number) {
        setEditingClassId(classId);
    }

    function handleDelete(classId: number) {
        setDeletingClassId(classId);
        setDeleteError("");
    }

    async function confirmDelete() {
        if (deletingClassId === null || isDeleting) return;

        setIsDeleting(true);
        setDeleteError("");

        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                deleted_class_id: number;
            }>("/teacher/classes/delete", {
                class_id: deletingClassId,
            });

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to delete class.",
                );
            }

            setDeletingClassId(null);
            setRefreshKey((previous) => previous + 1);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setDeleteError(
                    error.response?.data?.message ||
                    "Unable to delete class. Please try again.",
                );
            } else if (error instanceof Error) {
                setDeleteError(error.message);
            } else {
                setDeleteError("An unexpected error occurred.");
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="teacher-classes-page">
            <header className="teacher-classes-header">
                <div>
                    <h1>Classes Management</h1>
                    <p>
                        Organize your semester and track grading progress
                        {data &&
                            ` • ${data.current_academic_period.semester}, ${data.current_academic_period.school_year}`}
                    </p>
                </div>

                <button
                    type="button"
                    className="teacher-classes-create-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    + New Class
                </button>
            </header>

            <div className="teacher-classes-filter-bar">
                <select
                    className="teacher-classes-filter-select"
                    aria-label="Filter by semester"
                    value={selectedSemester ?? data?.filters.selected_semester ?? "all"}
                    onChange={(event) => {
                        setSelectedSemester(event.target.value);
                    }}
                >
                    <option value="all">All Semesters</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer</option>
                </select>

                <select
                    className="teacher-classes-filter-select"
                    aria-label="Filter by school year"
                    value={selectedYear ?? data?.filters.selected_year ?? "all"}
                    onChange={(event) => {
                        setSelectedYear(event.target.value);
                        setCustomYear("");
                        setYearError("");
                    }}
                >
                    <option value="all">All Years</option>

                    {data?.filters.available_years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}

                    {selectedYear &&
                        selectedYear !== "all" &&
                        !data?.filters.available_years.includes(selectedYear) && (
                            <option value={selectedYear}>{selectedYear}</option>
                        )}
                </select>

                <div className="teacher-classes-custom-year-wrapper">
                    <div className="teacher-classes-custom-year">
                        <span className="teacher-classes-or">or</span>

                        <input
                            type="text"
                            className="teacher-classes-year-input"
                            placeholder="e.g., 2015-2016"
                            aria-label="Custom academic year"
                            aria-invalid={Boolean(yearError)}
                            value={customYear}
                            onChange={(event) => {
                                setCustomYear(event.target.value);
                                setYearError("");
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleCustomYear();
                                }
                            }}
                        />

                        <button
                            type="button"
                            className="teacher-classes-year-submit"
                            onClick={handleCustomYear}
                            aria-label="Apply custom academic year"
                        >
                            →
                        </button>
                    </div>

                    {yearError && (
                        <span className="teacher-classes-year-error" role="alert">
                            {yearError}
                        </span>
                    )}
                </div>

                <input
                    type="search"
                    className="teacher-classes-search"
                    placeholder="Search classes..."
                    aria-label="Search classes"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />

                <span className="teacher-classes-visible-count">
                    {filteredClasses.length}{" "}
                    {filteredClasses.length === 1 ? "class" : "classes"}
                </span>
            </div>

            {error && (
                <p className="teacher-classes-error" role="alert">
                    {error}
                </p>
            )}

            {loading && !data ? (
                <p>Loading classes...</p>
            ) : data && (
                <>
                    {loading && (
                        <p className="teacher-classes-loading">
                            Updating classes...
                        </p>
                    )}

                    {filteredClasses.length > 0 ? (
                        <section
                            className="teacher-classes-grid"
                            aria-label="Classes"
                            aria-busy={loading}
                        >
                            {filteredClasses.map((classItem) => (
                                <TeacherClassCard
                                    key={classItem.id}
                                    classItem={classItem}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </section>
                    ) : (
                        <div className="teacher-classes-empty">
                            <h3>No classes found</h3>
                            <p>
                                {searchQuery
                                    ? "Try searching for a different class."
                                    : "No classes available for the selected academic period."}
                            </p>
                        </div>
                    )}
                </>
            )}

            {data && isCreateModalOpen && (
                <TeacherClassModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={() => setRefreshKey((previous) => previous + 1)}
                    currentAcademicPeriod={data.current_academic_period}
                />
            )}

            {data && editingClassId !== null && (
                <TeacherClassModal
                    key={editingClassId}
                    editClassId={editingClassId}
                    currentAcademicPeriod={data.current_academic_period}
                    onClose={() => setEditingClassId(null)}
                    onCreated={() => setRefreshKey((previous) => previous + 1)}
                />
            )}

            {deletingClassId !== null && (
                <TeacherDeleteClassModal
                    className={
                        data?.classes.find((item) => item.id === deletingClassId)?.name ??
                        "this class"
                    }
                    onClose={() => {
                        setDeletingClassId(null);
                        setDeleteError("");
                    }}
                    onConfirm={confirmDelete}
                    isDeleting={isDeleting}
                    error={deleteError}
                />
            )}
        </div>
    );
}

export default TeacherClasses;
