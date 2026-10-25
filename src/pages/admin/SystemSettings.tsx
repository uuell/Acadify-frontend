import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axios";
import "./SystemSettings.css";

type Semester = "1st Semester" | "2nd Semester" | "Summer";
type SettingsMode = "automatic" | "manual";

interface AcademicPeriod {
    school_year: string;
    semester: Semester;
}

interface SettingsResponse {
    success: boolean;
    current: AcademicPeriod;
    mode: SettingsMode;
    automatic_values: AcademicPeriod;
    manual_values: { school_year: string | null; semester: Semester | null };
    last_updated: string | null;
    updated_by: string | null;
    message?: string;
}

const semesters: Semester[] = ["1st Semester", "2nd Semester", "Summer"];

function errorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? "Unable to complete the request.";
    }
    return "An unexpected error occurred.";
}

export default function SystemSettings() {
    const [settings, setSettings] = useState<SettingsResponse | null>(null);
    const [mode, setMode] = useState<SettingsMode>("automatic");
    const [schoolYear, setSchoolYear] = useState("");
    const [semester, setSemester] = useState<Semester>("1st Semester");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const applySettings = useCallback((data: SettingsResponse) => {
        setSettings(data);
        setMode(data.mode);
        setSchoolYear(data.manual_values.school_year ?? data.current.school_year);
        setSemester(data.manual_values.semester ?? data.current.semester);
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const { data } = await api.get<SettingsResponse>("/admin/settings");
                if (!cancelled) {
                    applySettings(data);
                    setError("");
                }
            } catch (err) {
                if (!cancelled) setError(errorMessage(err));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [applySettings]);

    async function refreshSettings() {
        setLoading(true);
        setError("");
        try {
            const { data } = await api.get<SettingsResponse>("/admin/settings");
            applySettings(data);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function saveSettings() {
        if (!settings || saving) return;
        setError("");
        setNotice("");

        if (mode === "manual") {
            if (!/^\d{4}-\d{4}$/.test(schoolYear)) {
                setError("School year must use YYYY-YYYY format.");
                return;
            }
            const [start, end] = schoolYear.split("-").map(Number);
            if (end !== start + 1) {
                setError("School year must contain consecutive years.");
                return;
            }
        }

        const actionText = mode === "manual"
            ? `Set the academic period to ${schoolYear}, ${semester}?`
            : `Restore automatic academic period calculation (${settings.automatic_values.school_year}, ${settings.automatic_values.semester})?`;
        if (!window.confirm(`${actionText}\n\nThis changes the academic period used by other Acadify features.`)) return;

        setSaving(true);
        try {
            const payload = mode === "manual"
                ? { action: "update_academic", school_year: schoolYear, semester }
                : { action: "reset_to_auto" };
            const { data } = await api.post<{ success: boolean; message: string }>("/admin/settings", payload);
            const refreshed = await api.get<SettingsResponse>("/admin/settings");
            applySettings(refreshed.data);
            setNotice(data.message ?? "Settings saved successfully.");
        } catch (err) {
            setError(errorMessage(err));
            // The save may have succeeded even if the subsequent refresh failed.
            // Allow the administrator to refresh and verify the current values.
        } finally {
            setSaving(false);
        }
    }

    const changed = settings && (mode !== settings.mode || (mode === "manual" && (
        schoolYear !== settings.current.school_year || semester !== settings.current.semester
    )));

    return (
        <main className="system-settings-page">
            <div className="system-settings-heading">
                <div>
                    <h1>System Settings</h1>
                    <p>Manage Acadify's current academic period.</p>
                </div>
                <button type="button" className="system-settings-secondary" onClick={() => void refreshSettings()} disabled={loading || saving}>Refresh</button>
            </div>

            {error && <div className="system-settings-alert error" role="alert">{error}</div>}
            {notice && <div className="system-settings-alert success" role="status">{notice}</div>}

            {loading ? <div className="system-settings-panel">Loading academic settings...</div> : settings && (
                <>
                    <section className="system-settings-panel" aria-labelledby="current-period-title">
                        <div className="system-settings-panel-header">
                            <h2 id="current-period-title">Current Academic Period</h2>
                            <span className={`system-settings-badge ${settings.mode}`}>{settings.mode === "manual" ? "Manual" : "Automatic"}</span>
                        </div>
                        <div className="system-settings-summary">
                            <div><span>School Year</span><strong>{settings.current.school_year}</strong></div>
                            <div><span>Semester</span><strong>{settings.current.semester}</strong></div>
                        </div>
                        <p className="system-settings-muted">Automatic calculation currently gives {settings.automatic_values.school_year} · {settings.automatic_values.semester}.</p>
                    </section>

                    <section className="system-settings-panel" aria-labelledby="configuration-title">
                        <h2 id="configuration-title">Academic Period Configuration</h2>
                        <p className="system-settings-muted">Choose whether Acadify calculates the academic period automatically or uses values set by an administrator.</p>
                        <fieldset className="system-settings-modes" disabled={saving}>
                            <legend className="system-settings-visually-hidden">Configuration mode</legend>
                            <label className={`system-settings-mode ${mode === "automatic" ? "selected" : ""}`}>
                                <input type="radio" name="academic-mode" checked={mode === "automatic"} onChange={() => setMode("automatic")} />
                                <span><strong>Automatic</strong><small>Use Acadify's calculated school year and semester.</small></span>
                            </label>
                            <label className={`system-settings-mode ${mode === "manual" ? "selected" : ""}`}>
                                <input type="radio" name="academic-mode" checked={mode === "manual"} onChange={() => setMode("manual")} />
                                <span><strong>Manual</strong><small>Override the academic period until automatic mode is restored.</small></span>
                            </label>
                        </fieldset>

                        {mode === "manual" && (
                            <div className="system-settings-fields">
                                <label htmlFor="system-school-year">School Year
                                    <input id="system-school-year" name="school_year" value={schoolYear} onChange={event => setSchoolYear(event.target.value)} placeholder="2026-2027" disabled={saving} />
                                    <small>Format: YYYY-YYYY (consecutive years)</small>
                                </label>
                                <label htmlFor="system-semester">Semester
                                    <select id="system-semester" name="semester" value={semester} onChange={event => setSemester(event.target.value as Semester)} disabled={saving}>
                                        {semesters.map(item => <option key={item} value={item}>{item}</option>)}
                                    </select>
                                </label>
                            </div>
                        )}
                        <div className="system-settings-actions">
                            <button type="button" className="system-settings-primary" onClick={() => void saveSettings()} disabled={saving || !changed}>{saving ? "Saving..." : mode === "automatic" ? "Restore Automatic Mode" : "Save Academic Settings"}</button>
                            <span className="system-settings-muted">Changes may affect current classes, enrollments, and progression checks.</span>
                        </div>
                    </section>

                    <section className="system-settings-panel" aria-labelledby="settings-history-title">
                        <h2 id="settings-history-title">Configuration Information</h2>
                        <dl className="system-settings-info">
                            <div><dt>Active Mode</dt><dd>{settings.mode === "manual" ? "Manual override" : "Automatic calculation"}</dd></div>
                            <div><dt>Last Updated By</dt><dd>{settings.updated_by ?? "Not available"}</dd></div>
                            <div><dt>Last Updated</dt><dd>{settings.last_updated ? new Date(settings.last_updated).toLocaleString() : "Not available"}</dd></div>
                        </dl>
                    </section>
                </>
            )}
        </main>
    );
}
