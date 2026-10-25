
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { TeacherClassAcademicPeriod } from "../../types/teacherClasses";

import TeacherGradingFormula from "./TeacherGradingFormula";
import type { GradingComponent } from "./TeacherGradingFormula";

import axios from "axios";
import api from "../../api/axios";
import TeacherStudentRoster from "./TeacherStudentRoster";

import type {
    TeacherStudent,
    TeacherStudentsResponse,
    TeacherEnrolledStudentsResponse,
} from "../../types/teacherStudents";

import type { TeacherClassEditResponse } from "../../types/teacherClasses";

interface TeacherClassModalProps {
    onClose: () => void;
    onCreated: () => void;
    currentAcademicPeriod: TeacherClassAcademicPeriod;
    editClassId?: number;
}

export interface TeacherClassFormValues {
    subject_name: string;
    subject_code: string;
    units: number;
    section: string;
    room: string;
    schedule: string;
    school_year: string;
    semester: string;
    max_students: number;
}

function TeacherClassModal({
    onClose,
    onCreated,
    currentAcademicPeriod,
    editClassId,
}: TeacherClassModalProps) {
    const isEditMode = editClassId !== undefined;
    const lockClassIdentity = isEditMode;

    const [form, setForm] = useState<TeacherClassFormValues>({
        subject_name: "",
        subject_code: "",
        units: 3,
        section: "",
        room: "",
        schedule: "",
        school_year: currentAcademicPeriod.school_year,
        semester: currentAcademicPeriod.semester,
        max_students: 40,
    });
    const [gradingComponents, setGradingComponents] = useState<GradingComponent[]>([
        { name: "Midterm Exam", weight: 50 },
        { name: "Final Exam", weight: 50 },
    ]);

    const [formulaExpanded, setFormulaExpanded] = useState(true);
    const [formulaError, setFormulaError] = useState("");

    const [students, setStudents] = useState<TeacherStudent[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(true);
    const [studentsError, setStudentsError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [editLoading, setEditLoading] = useState(isEditMode);
    const [editError, setEditError] = useState("");
    const [canEditFormula, setCanEditFormula] = useState(true);

    const [rosterLoading, setRosterLoading] = useState(isEditMode);
    const [rosterError, setRosterError] = useState("");


    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && !isSubmitting) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose, isSubmitting]);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchStudents() {
            try {
                const response = await api.get<TeacherStudentsResponse>(
                    "/teacher/students",
                    {
                        signal: controller.signal,
                    },
                );

                if (!response.data.success) {
                    throw new Error("Unable to load students.");
                }

                setStudents(response.data.students);
            } catch (error) {
                if (controller.signal.aborted) return;

                if (axios.isAxiosError(error)) {
                    setStudentsError(
                        error.response?.data?.message ||
                        "Unable to load students.",
                    );
                } else {
                    setStudentsError("Unable to load students.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setStudentsLoading(false);
                }
            }
        }

        fetchStudents();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (editClassId === undefined) return;

        const controller = new AbortController();

        async function fetchEditData() {
            try {
                const response = await api.get<TeacherClassEditResponse>(
                    `/teacher/classes/${editClassId}/edit-data`,
                    { signal: controller.signal },
                );

                if (!response.data.success) {
                    throw new Error("Unable to load class information.");
                }

                const classData = response.data.class;

                setForm({
                    subject_name: classData.subject_name,
                    subject_code: classData.subject_code ?? "",
                    units: classData.units,
                    section: classData.section,
                    room: classData.room ?? "",
                    schedule: classData.schedule ?? "",
                    school_year: classData.school_year,
                    semester: classData.semester,
                    max_students: classData.max_students,
                });

                setGradingComponents(classData.grading_formula.components);
                setCanEditFormula(classData.can_edit_formula);
            } catch (error) {
                if (controller.signal.aborted) return;

                if (axios.isAxiosError(error)) {
                    setEditError(
                        error.response?.data?.message ||
                        "Unable to load class information.",
                    );
                } else {
                    setEditError("Unable to load class information.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setEditLoading(false);
                }
            }
        }

        fetchEditData();

        return () => controller.abort();
    }, [editClassId]);


    useEffect(() => {
        if (editClassId === undefined) return;

        const controller = new AbortController();

        async function fetchEnrolledStudents() {
            try {
                const response = await api.get<TeacherEnrolledStudentsResponse>(
                    `/teacher/classes/${editClassId}/enrolled-students`,
                    { signal: controller.signal },
                );

                if (!response.data.success) {
                    throw new Error("Unable to load enrolled students.");
                }

                setSelectedStudentIds(
                    response.data.students.map((student) => student.id),
                );
            } catch (error) {
                if (controller.signal.aborted) return;

                if (axios.isAxiosError(error)) {
                    setRosterError(
                        error.response?.data?.message ||
                        "Unable to load enrolled students.",
                    );
                } else {
                    setRosterError("Unable to load enrolled students.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setRosterLoading(false);
                }
            }
        }

        fetchEnrolledStudents();

        return () => controller.abort();
    }, [editClassId]);

    function updateField<K extends keyof TeacherClassFormValues>(
        field: K,
        value: TeacherClassFormValues[K],
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            isSubmitting ||
            studentsLoading ||
            Boolean(studentsError) ||
            (isEditMode &&
                (editLoading || editError || rosterLoading || rosterError))
        ) {
            return;
        }

        setSubmitError("");
        setFormulaError("");

        const totalWeight = gradingComponents.reduce(
            (sum, component) => sum + component.weight,
            0,
        );

        if (
            gradingComponents.length === 0 ||
            gradingComponents.some((component) => !component.name.trim()) ||
            gradingComponents.some(
                (component) =>
                    !Number.isFinite(component.weight) ||
                    component.weight < 0 ||
                    component.weight > 100,
            ) ||
            Math.abs(totalWeight - 100) > 0.001
        ) {
            setFormulaError(
                "Enter valid grading components with weights totaling 100%.",
            );
            setFormulaExpanded(true);
            return;
        }

        if (studentsLoading || studentsError) {
            setSubmitError(
                "Student information is not available. Please try again.",
            );
            return;
        }

        if (
            !Number.isInteger(form.max_students) ||
            form.max_students < 1 ||
            form.max_students > 100
        ) {
            setSubmitError(
                "Maximum students must be between 1 and 100.",
            );
            return;
        }

        if (selectedStudentIds.length > form.max_students) {
            setSubmitError(
                `You selected ${selectedStudentIds.length} students, but the class capacity is ${form.max_students}.`,
            );
            return;
        }

        const payload = {
            ...form,
            subject_name: form.subject_name.trim(),
            subject_code: form.subject_code.trim(),
            section: form.section.trim(),
            room: form.room.trim(),
            schedule: form.schedule.trim(),
            student_ids: selectedStudentIds,
            grading_formula: {
                components: gradingComponents.map((component) => ({
                    name: component.name.trim(),
                    weight: component.weight,
                })),
                use_philippine_conversion: true,
            },
        };

        try {
            setIsSubmitting(true);

            let response;

            if (isEditMode) {
                const updatePayload = {
                    room: form.room.trim(),
                    schedule: form.schedule.trim(),
                    max_students: form.max_students,
                    student_ids: selectedStudentIds,
                    ...(canEditFormula
                        ? { grading_formula: payload.grading_formula }
                        : {}),
                };

                response = await api.post<{
                    success: boolean;
                    message: string;
                }>(
                    `/teacher/classes/${editClassId}/update`,
                    updatePayload,
                );
            } else {
                response = await api.post<{
                    success: boolean;
                    message: string;
                    class?: { id: number };
                }>("/teacher/classes/create", payload);
            }

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to save class.",
                );
            }

            onCreated();
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSubmitError(
                    error.response?.data?.message ||
                    "Unable to save class. Please try again.",
                );
            } else if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError("An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            className="teacher-class-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSubmitting) {
                    onClose();
                }
            }}
        >
            <div
                className="teacher-class-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="teacher-class-modal-title"
            >
                <h2 id="teacher-class-modal-title">
                    {isEditMode ? "Edit Class" : "Create New Class"}
                </h2>

                {editLoading && (
                    <p className="teacher-roster-description">
                        Loading class information...
                    </p>
                )}

                {editError && (
                    <p className="teacher-grading-error" role="alert">
                        {editError}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="teacher-class-form-group">
                        <label htmlFor="class-subject-name" className="required-label">
                            Subject Name *
                        </label>
                        <input
                            id="class-subject-name"
                            className="teacher-class-form-input"
                            placeholder="e.g., Data Structures and Algorithms"
                            required
                            disabled={lockClassIdentity}
                            value={form.subject_name}
                            onChange={(event) =>
                                updateField("subject_name", event.target.value)
                            }
                        />
                        <small>
                            Enter the full name of the subject you're teaching
                        </small>
                    </div>

                    <div className="teacher-class-form-row">
                        <div className="teacher-class-form-group">
                            <label htmlFor="class-subject-code">Subject Code</label>
                            <input
                                id="class-subject-code"
                                className="teacher-class-form-input"
                                placeholder="e.g., CS201"
                                disabled={lockClassIdentity}
                                value={form.subject_code}
                                onChange={(event) =>
                                    updateField("subject_code", event.target.value)
                                }
                            />
                            <small>Optional course code</small>
                        </div>

                        <div className="teacher-class-form-group">
                            <label htmlFor="class-units" className="required-label">
                                Units *
                            </label>
                            <input
                                id="class-units"
                                type="number"
                                min={1}
                                max={6}
                                required
                                className="teacher-class-form-input"
                                disabled={lockClassIdentity}
                                value={form.units}
                                onChange={(event) =>
                                    updateField("units", Number(event.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div className="teacher-class-form-row">
                        <div className="teacher-class-form-group">
                            <label htmlFor="class-section" className="required-label">
                                Section *
                            </label>
                            <input
                                id="class-section"
                                className="teacher-class-form-input"
                                placeholder="A"
                                required
                                disabled={lockClassIdentity}
                                value={form.section}
                                onChange={(event) =>
                                    updateField("section", event.target.value)
                                }
                            />
                        </div>

                        <div className="teacher-class-form-group">
                            <label htmlFor="class-room">Room</label>
                            <input
                                id="class-room"
                                className="teacher-class-form-input"
                                placeholder="Room 301"
                                value={form.room}
                                onChange={(event) =>
                                    updateField("room", event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="teacher-class-form-group">
                        <label htmlFor="class-schedule">Schedule</label>
                        <input
                            id="class-schedule"
                            className="teacher-class-form-input"
                            placeholder="MWF 9:00-10:30"
                            value={form.schedule}
                            onChange={(event) =>
                                updateField("schedule", event.target.value)
                            }
                        />
                        <small>
                            e.g., "MWF 9:00-10:30" or "TTh 1:00-2:30"
                        </small>
                    </div>

                    <div className="teacher-class-form-row">
                        <div className="teacher-class-form-group">
                            <label htmlFor="class-school-year" className="required-label">
                                School Year *
                            </label>
                            <input
                                id="class-school-year"
                                className="teacher-class-form-input"
                                placeholder="2026-2027"
                                required
                                disabled={lockClassIdentity}
                                value={form.school_year}
                                onChange={(event) =>
                                    updateField("school_year", event.target.value)
                                }
                            />
                        </div>

                        <div className="teacher-class-form-group">
                            <label htmlFor="class-semester" className="required-label">
                                Semester *
                            </label>
                            <select
                                id="class-semester"
                                className="teacher-class-form-input"
                                required
                                disabled={lockClassIdentity}
                                value={form.semester}
                                onChange={(event) =>
                                    updateField("semester", event.target.value)
                                }
                            >
                                <option value="1st Semester">1st Semester</option>
                                <option value="2nd Semester">2nd Semester</option>
                                <option value="Summer">Summer</option>
                            </select>
                        </div>
                    </div>

                    <div className="teacher-class-form-group">
                        <label htmlFor="class-max-students">Maximum Students</label>
                        <input
                            id="class-max-students"
                            type="number"
                            min={1}
                            max={100}
                            className="teacher-class-form-input"
                            value={form.max_students}
                            onChange={(event) =>
                                updateField("max_students", Number(event.target.value))
                            }
                        />
                    </div>

                    <div className="teacher-class-formula-section">
                        <button
                            type="button"
                            className="teacher-class-formula-toggle"
                            aria-expanded={formulaExpanded}
                            onClick={() => setFormulaExpanded((previous) => !previous)}
                        >
                            <span>Grading Formula Configuration</span>
                            <span>{formulaExpanded ? "−" : "+"}</span>
                        </button>

                        {formulaExpanded && (
                            <>
                                <fieldset
                                    disabled={isEditMode && !canEditFormula}
                                    className="teacher-grading-fieldset"
                                >
                                    <TeacherGradingFormula
                                        components={gradingComponents}
                                        onComponentsChange={(components) => {
                                            setGradingComponents(components);
                                            setFormulaError("");
                                        }}
                                    />
                                </fieldset>

                                {isEditMode && !canEditFormula && !editLoading && !editError && (
                                    <p className="teacher-roster-description">
                                        The grading formula cannot be changed because grading records
                                        already exist for this class.
                                    </p>
                                )}
                            </>
                        )}

                        {formulaError && (
                            <p className="teacher-grading-error" role="alert">
                                {formulaError}
                            </p>
                        )}
                    </div>
                    {studentsLoading || rosterLoading ? (
                        <p className="teacher-roster-description">
                            Loading students...
                        </p>
                    ) : studentsError || rosterError ? (
                        <p className="teacher-grading-error" role="alert">
                            {studentsError || rosterError}
                        </p>
                    ) : (
                        <TeacherStudentRoster
                            students={students}
                            selectedStudentIds={selectedStudentIds}
                            onSelectionChange={setSelectedStudentIds}
                            maxStudents={form.max_students}
                        />
                    )}

                    {submitError && (
                        <p className="teacher-grading-error" role="alert">
                            {submitError}
                        </p>
                    )}

                    <div className="teacher-class-modal-footer">
                        <button
                            type="button"
                            className="teacher-class-modal-cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="teacher-class-submit-btn"
                            disabled={
                                isSubmitting ||
                                studentsLoading ||
                                Boolean(studentsError) ||
                                editLoading ||
                                Boolean(editError) ||
                                rosterLoading ||
                                Boolean(rosterError)
                            }
                        >
                            {isSubmitting
                                ? isEditMode
                                    ? "Saving Changes..."
                                    : "Creating Class..."
                                : isEditMode
                                    ? "Save Changes"
                                    : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TeacherClassModal;
