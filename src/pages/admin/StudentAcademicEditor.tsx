import { useState, type FormEvent } from "react";
import axios from "axios";
import api from "../../api/axios";
import "./StudentAcademicEditor.css";

export interface AcademicStudent {
    profile_id: number;
    name: string;
    id_number: string;
    program?: string | null;
    year_level?: string | null;
    enrollment_classification?: string | null;
    academic_status?: string | null;
}

interface Props {
    student: AcademicStudent;
    onClose: () => void;
    onSaved: () => void;
}

interface AcademicResponse {
    success: boolean;
    message?: string;
}

const classifications = ["Regular", "Irregular", "Not Yet Verified"] as const;
const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

function errorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? "Request failed. Please try again.";
    }
    return error instanceof Error ? error.message : "Unexpected error.";
}

export default function StudentAcademicEditor({ student, onClose, onSaved }: Props) {
    const [yearLevel, setYearLevel] = useState(student.year_level ?? "");
    const [classification, setClassification] = useState(student.enrollment_classification ?? "Not Yet Verified");
    const [reversalReason, setReversalReason] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const graduated = student.academic_status === "Graduated";
    const endpoint = `/admin/students/${student.profile_id}`;

    async function saveAcademic(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const changes: Record<string, string> = {};
        if (yearLevel.trim() !== (student.year_level ?? "")) changes.year_level = yearLevel.trim();
        if (classification !== (student.enrollment_classification ?? "Not Yet Verified")) {
            changes.enrollment_classification = classification;
        }
        if (!Object.keys(changes).length) { setError("No changes to save."); return; }
        setBusy(true); setError(""); setSuccess("");
        try {
            const response = await api.patch<AcademicResponse>(`${endpoint}/academic`, changes);
            if (!response.data.success) throw new Error(response.data.message ?? "Update failed.");
            setSuccess(response.data.message ?? "Academic information updated.");
            onSaved();
        } catch (err) { setError(errorMessage(err)); }
        finally { setBusy(false); }
    }

    async function graduate() {
        if (!window.confirm(`Mark ${student.name} as Graduated? This changes their official academic status.`)) return;
        setBusy(true); setError(""); setSuccess("");
        try {
            const response = await api.patch<AcademicResponse>(`${endpoint}/academic`, {
                academic_status: "Graduated", confirm_graduation: true,
            });
            if (!response.data.success) throw new Error(response.data.message ?? "Graduation failed.");
            setSuccess(response.data.message ?? "Student marked as graduated.");
            onSaved();
        } catch (err) { setError(errorMessage(err)); }
        finally { setBusy(false); }
    }

    async function reverseGraduation() {
        const reason = reversalReason.trim();
        if (!reason) { setError("Enter a reason for graduation reversal."); return; }
        if (!window.confirm(`Reverse graduation for ${student.name}? The system will recalculate Active or Inactive.`)) return;
        setBusy(true); setError(""); setSuccess("");
        try {
            const response = await api.post<AcademicResponse>(`${endpoint}/reverse-graduation`, {
                confirm_reversal: true, reason,
            });
            if (!response.data.success) throw new Error(response.data.message ?? "Reversal failed.");
            setSuccess(response.data.message ?? "Graduation reversed.");
            onSaved();
        } catch (err) { setError(errorMessage(err)); }
        finally { setBusy(false); }
    }

    return (
        <div className="academic-editor-backdrop" role="presentation">
            <section className="academic-editor" role="dialog" aria-modal="true" aria-labelledby="academic-editor-title">
                <div className="academic-editor-header">
                    <div><h2 id="academic-editor-title">Student Academic Information</h2><p>{student.name} · {student.id_number}</p></div>
                    <button type="button" onClick={onClose} disabled={busy} aria-label="Close academic editor">✕</button>
                </div>
                <div className="academic-editor-body">
                    <p><strong>Program:</strong> {student.program || "Not specified"}</p>
                    <p><strong>Academic status:</strong> {student.academic_status || "Not available"}</p>
                    <p className="academic-editor-hint">Active and Inactive are determined by enrollment and cannot be manually assigned.</p>
                    {error && <p className="academic-editor-error" role="alert">{error}</p>}
                    {success && <p className="academic-editor-success" role="status">{success}</p>}
                    <form onSubmit={(event) => void saveAcademic(event)}>
                        <label htmlFor="academic-year-level">Year Level</label>
                        <select id="academic-year-level" value={yearLevel} onChange={(event) => setYearLevel(event.target.value)} disabled={busy} required>
                            <option value="">Select year level</option>
                            {!yearLevels.includes(yearLevel) && yearLevel && <option value={yearLevel}>{yearLevel}</option>}
                            {yearLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                        </select>
                        <label htmlFor="academic-classification">Enrollment Classification</label>
                        <select id="academic-classification" value={classification} onChange={(event) => setClassification(event.target.value)} disabled={busy}>
                            {classifications.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <button type="submit" disabled={busy}>{busy ? "Saving..." : "Save Academic Changes"}</button>
                    </form>
                    <div className="academic-editor-graduation">
                        <h3>Graduation Management</h3>
                        {graduated ? (
                            <><label htmlFor="graduation-reason">Reason for reversal</label>
                                <textarea id="graduation-reason" rows={3} value={reversalReason} onChange={(event) => setReversalReason(event.target.value)} disabled={busy} placeholder="Required reason for reversing graduation" />
                                <button type="button" className="academic-editor-danger" onClick={() => void reverseGraduation()} disabled={busy || !reversalReason.trim()}>Reverse Graduation</button></>
                        ) : (
                            <><p>Only mark a student as graduated after verifying their academic requirements.</p>
                                <button type="button" className="academic-editor-danger" onClick={() => void graduate()} disabled={busy}>Mark as Graduated</button></>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
