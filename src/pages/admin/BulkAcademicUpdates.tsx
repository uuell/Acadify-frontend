import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import api from "../../api/axios";
import "./BulkAcademicUpdates.css";

type AcademicValues = { year_level: string; enrollment_classification: string };
type PreviewRow = {
    row: number;
    student_id: number;
    student_number: string;
    student_name: string;
    current: AcademicValues;
    proposed: AcademicValues;
};
type RowError = { row: number; message: string };
type PreviewResponse = {
    success: boolean;
    message?: string;
    summary: { valid: number; errors: number };
    preview: PreviewRow[];
    errors: RowError[];
};
type ConfirmResponse = {
    success: boolean;
    message?: string;
    summary?: { updated: number; errors: number };
    errors?: RowError[];
};

function errorMessage(error: unknown) {
    if (axios.isAxiosError(error)) return error.response?.data?.message || "Request failed. Please try again.";
    return error instanceof Error ? error.message : "Unexpected error.";
}

export default function BulkAcademicUpdates({ onSuccess }: { onSuccess?: () => void | Promise<void> }) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<PreviewResponse | null>(null);
    const [confirmErrors, setConfirmErrors] = useState<RowError[]>([]);
    const [busy, setBusy] = useState<"preview" | "confirm" | "csv" | "xlsx" | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const fileInput = useRef<HTMLInputElement>(null);

    function changeFile(event: ChangeEvent<HTMLInputElement>) {
        setFile(event.target.files?.[0] ?? null);
        setPreview(null);
        setConfirmErrors([]);
        setError("");
        setSuccess("");
    }

    async function downloadTemplate(format: "csv" | "xlsx") {
        setBusy(format);
        setError("");
        try {
            const response = await api.get<Blob>("/admin/download/academic-update-template", {
                params: { format }, responseType: "blob",
            });
            const url = URL.createObjectURL(response.data);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `acadify_student_academic_update_template.${format}`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setBusy(null);
        }
    }

    async function handlePreview(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!file || busy) return;
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext !== "csv" && ext !== "xlsx") {
            setError("Select a CSV or XLSX file.");
            return;
        }
        setBusy("preview");
        setPreview(null);
        setConfirmErrors([]);
        setError("");
        setSuccess("");
        try {
            const body = new FormData();
            body.append("csv_file", file);
            const { data } = await api.post<PreviewResponse>("/admin/students/academic/bulk-preview", body);
            if (!data.success) throw new Error(data.message || "Preview failed.");
            setPreview(data);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setBusy(null);
        }
    }

    async function handleConfirm() {
        if (!preview?.preview.length || busy) return;
        const count = preview.preview.length;
        if (!window.confirm(`Apply academic updates for ${count} student(s)?${preview.errors.length ? `\n\n${preview.errors.length} invalid row(s) will be excluded.` : ""}\n\nThis changes official academic records.`)) return;
        setBusy("confirm");
        setError("");
        setSuccess("");
        setConfirmErrors([]);
        try {
            const updates = preview.preview.map(({ student_number, current, proposed }) => ({ student_number, current, proposed }));
            const { data } = await api.post<ConfirmResponse>("/admin/students/academic/bulk-confirm", {
                confirm: true,
                updates,
            });
            if (!data.success) throw new Error(data.message || "Confirmation failed.");
            setSuccess(`${data.message || "Updates applied."} ${data.summary?.updated ?? count} student(s) updated.`);
            setPreview(null);
            setFile(null);
            if (fileInput.current) fileInput.current.value = "";
            try { await onSuccess?.(); } catch (refreshError) { console.error("Unable to refresh users:", refreshError); }
        } catch (err) {
            if (axios.isAxiosError(err)) setConfirmErrors(err.response?.data?.errors ?? []);
            setError(errorMessage(err));
        } finally {
            setBusy(null);
        }
    }

    return (
        <section className="admin-bulk-academic">
            <div className="admin-bulk-academic-heading">
                <div>
                    <h2>Bulk Academic Updates</h2>
                    <p>Update year levels and enrollment classifications from a CSV or Excel file. Review changes before applying them.</p>
                </div>
                <div className="admin-bulk-academic-actions">
                    <button type="button" disabled={busy !== null} onClick={() => void downloadTemplate("csv")}>CSV Template</button>
                    <button type="button" disabled={busy !== null} onClick={() => void downloadTemplate("xlsx")}>Excel Template</button>
                </div>
            </div>
            <form onSubmit={(event) => void handlePreview(event)} className="admin-bulk-academic-upload">
                <div className="admin-bulk-academic-file-picker">
                    <div className="admin-bulk-academic-file-icon" aria-hidden="true">↑</div>
                    <div className="admin-bulk-academic-file-text">
                        <strong title={file?.name}>{file ? file.name : "Choose an academic update file"}</strong>
                        <span>{file ? "File selected · CSV or Excel" : "Supported formats: .csv and .xlsx"}</span>
                    </div>
                    <input
                        ref={fileInput}
                        id="admin-academic-file"
                        className="admin-bulk-academic-native-input"
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={changeFile}
                        disabled={busy !== null}
                        tabIndex={-1}
                        aria-label="Academic update file"
                    />
                    <button
                        type="button"
                        className="admin-bulk-academic-browse"
                        disabled={busy !== null}
                        onClick={() => fileInput.current?.click()}
                    >
                        Browse Files
                    </button>
                </div>
                <button className="admin-bulk-academic-preview-button" type="submit" disabled={!file || busy !== null}>
                    {busy === "preview" ? "Generating preview..." : "Preview Updates"}
                </button>
            </form>
            {error && <p className="admin-bulk-academic-error" role="alert">{error}</p>}
            {success && <p className="admin-bulk-academic-success" role="status">{success}</p>}
            {confirmErrors.length > 0 && <div className="admin-bulk-academic-errors"><h3>Confirmation errors</h3><ul>{confirmErrors.map((item, index) => <li key={`${item.row}-${index}`}>Update {item.row}: {item.message}</li>)}</ul><p>Nothing was applied. Generate a new preview before retrying if the data has changed.</p></div>}
            {preview && <div className="admin-bulk-academic-preview">
                <div className="admin-bulk-academic-summary"><strong>{preview.summary.valid} valid</strong><strong>{preview.summary.errors} errors</strong></div>
                {preview.errors.length > 0 && <div className="admin-bulk-academic-errors"><h3>Rows excluded from confirmation</h3><ul>{preview.errors.map((item, index) => <li key={`${item.row}-${index}`}>Row {item.row}: {item.message}</li>)}</ul></div>}
                {preview.preview.length > 0 ? <>
                    <div className="admin-bulk-academic-table-wrap"><table><thead><tr><th>Row</th><th>Student</th><th>Current Year</th><th>Proposed Year</th><th>Current Classification</th><th>Proposed Classification</th></tr></thead><tbody>
                        {preview.preview.map((item) => <tr key={`${item.student_number}-${item.row}`}><td>{item.row}</td><td><strong>{item.student_name}</strong><span>{item.student_number}</span></td><td>{item.current.year_level}</td><td>{item.proposed.year_level}</td><td>{item.current.enrollment_classification}</td><td>{item.proposed.enrollment_classification}</td></tr>)}
                    </tbody></table></div>
                    <p className="admin-bulk-academic-note">Only the {preview.preview.length} valid row(s) above will be submitted. All submitted updates succeed together or none are applied.</p>
                    <button type="button" className="admin-bulk-academic-confirm" disabled={busy !== null} onClick={() => void handleConfirm()}>{busy === "confirm" ? "Applying updates..." : `Confirm ${preview.preview.length} Update(s)`}</button>
                </> : <p>No valid updates to confirm. Correct the file and preview again.</p>}
            </div>}
        </section>
    );
}
