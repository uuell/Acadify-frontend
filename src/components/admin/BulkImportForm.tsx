
import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import axios from "axios";

import api from "../../api/axios";
import "./StudentRegistrationForm.css";

type ImportType = "student" | "teacher";
type TemplateFormat = "csv" | "xlsx";

interface BulkImportFormProps {
    onSuccess?: () => void | Promise<void>;
}

interface BulkImportResponse {
    success: boolean;
    message?: string;
    summary?: {
        imported: number;
        errors: number;
    };
    errors?: {
        row: number;
        message: string;
    }[];
}

function BulkImportForm({ onSuccess }: BulkImportFormProps) {
    const [importType, setImportType] = useState<ImportType>("student");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [importResult, setImportResult] =
        useState<BulkImportResponse | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    function resetFeedback() {
        setError("");
        setSuccess("");
        setImportResult(null);
    }

    function handleTypeChange(type: ImportType) {
        setImportType(type);
        setSelectedFile(null);
        resetFeedback();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        setSelectedFile(event.target.files?.[0] ?? null);
        resetFeedback();
    }

    async function handleUpload(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (uploading || !selectedFile) return;

        resetFeedback();

        const extension = selectedFile.name
            .split(".")
            .pop()
            ?.toLowerCase();

        if (extension !== "csv" && extension !== "xlsx") {
            setError("Please select a CSV or Excel (.xlsx) file.");
            return;
        }

        const formData = new FormData();
        formData.append("csv_file", selectedFile);

        const endpoint =
            importType === "student"
                ? "/admin/bulk-import-students"
                : "/admin/bulk-import-teachers";

        setUploading(true);

        try {
            const response = await api.post<BulkImportResponse>(
                endpoint,
                formData,
            );

            setImportResult(response.data);

            if (!response.data.success) {
                setError(response.data.message || "Bulk import failed.");
                return;
            }

            setSuccess(
                response.data.message || "Bulk import completed successfully.",
            );

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (onSuccess) {
                try {
                    await onSuccess();
                } catch (refreshError) {
                    console.error("Dashboard refresh failed:", refreshError);
                }
            }
        } catch (err: unknown) {
            console.error("Bulk import error:", err);

            if (axios.isAxiosError(err)) {
                const responseData = err.response?.data as
                    | BulkImportResponse
                    | undefined;

                if (responseData) {
                    setImportResult(responseData);
                }

                setError(
                    responseData?.message ||
                    "Unable to import records. Please check your file.",
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred.",
                );
            }
        } finally {
            setUploading(false);
        }
    }

    async function handleTemplateDownload(format: TemplateFormat) {
        if (downloading) return;

        resetFeedback();
        setDownloading(true);

        try {
            const endpoint =
                importType === "student"
                    ? "/admin/download/student-template"
                    : "/admin/download/teacher-template";

            const response = await api.get<Blob>(endpoint, {
                params: { format },
                responseType: "blob",
            });

            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");

            link.href = url;
            link.download = `${importType}_import_template.${format}`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        } catch (err: unknown) {
            console.error("Template download error:", err);
            setError("Unable to download the template.");
        } finally {
            setDownloading(false);
        }
    }

    return (
        <section className="admin-registration-form">
            <div className="admin-registration-heading">
                <h3>Bulk User Import</h3>
                <p>
                    Register multiple students or teachers using a CSV or Excel file.
                </p>
            </div>

            <div className="admin-form-field">
                <label htmlFor="bulk-import-type">Import Type</label>
                <select
                    id="bulk-import-type"
                    value={importType}
                    onChange={(event) =>
                        handleTypeChange(event.target.value as ImportType)
                    }
                    disabled={uploading || downloading}
                >
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                </select>
            </div>

            <div className="admin-registration-actions">
                <button
                    type="button"
                    disabled={uploading || downloading}
                    onClick={() => void handleTemplateDownload("csv")}
                >
                    Download CSV Template
                </button>

                <button
                    type="button"
                    disabled={uploading || downloading}
                    onClick={() => void handleTemplateDownload("xlsx")}
                >
                    Download Excel Template
                </button>
            </div>

            <form onSubmit={(event) => void handleUpload(event)}>
                <div className="admin-form-field">
                    <label htmlFor="bulk-import-file">Upload File</label>
                    <input
                        ref={fileInputRef}
                        id="bulk-import-file"
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileChange}
                        disabled={uploading}
                        required
                    />
                </div>

                {error && (
                    <p className="admin-registration-error" role="alert">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="admin-registration-success" role="status">
                        {success}
                    </p>
                )}

                {importResult && (
                    <div className="admin-import-result">
                        {importResult.summary && (
                            <>
                                <p>Imported: {importResult.summary.imported}</p>
                                <p>Errors: {importResult.summary.errors}</p>
                            </>
                        )}

                        {importResult.errors && importResult.errors.length > 0 && (
                            <div>
                                <h4>Import Errors</h4>

                                <ul>
                                    {importResult.errors.map((error, index) => (
                                        <li key={`${error.row}-${index}`}>
                                            Row {error.row}: {error.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="admin-registration-actions">
                    <button
                        type="submit"
                        disabled={uploading || downloading || !selectedFile}
                    >
                        {uploading ? "Importing..." : "Import Users"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default BulkImportForm;
