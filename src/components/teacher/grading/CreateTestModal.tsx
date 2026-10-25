import { useState } from "react";
import type { FormEvent } from "react";
import "./ScoreEntryModal.css";

interface GradingComponent {
    name: string;
}

interface CreateTestModalProps {
    components: GradingComponent[];
    onClose: () => void;
    onSave: (data: {
        title: string;
        term_tag: string;
        component_tag: string;
        max_score: number;
    }) => void;
    saving: boolean;
}

export default function CreateTestModal({
    components,
    onClose,
    onSave,
    saving,
}: CreateTestModalProps) {
    const [title, setTitle] = useState("");
    const [termTag, setTermTag] = useState("Prelims");
    const [componentTag, setComponentTag] = useState(
        components[0]?.name ?? ""
    );
    const [maxScore, setMaxScore] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const maximum = Number(maxScore);

        if (!title.trim()) {
            setError("Activity title is required.");
            return;
        }

        if (title.trim().length > 200) {
            setError("Activity title cannot exceed 200 characters.");
            return;
        }

        if (!componentTag) {
            setError("Select a grading component.");
            return;
        }

        if (
            maxScore.trim() === "" ||
            !Number.isFinite(maximum) ||
            maximum <= 0
        ) {
            setError("Maximum score must be greater than zero.");
            return;
        }

        onSave({
            title: title.trim(),
            term_tag: termTag,
            component_tag: componentTag,
            max_score: maximum,
        });
    }

    return (
        <div
            className="grading-modal-overlay"
            onClick={() => {
                if (!saving) onClose();
            }}
        >
            <div
                className="grading-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-test-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="grading-modal-header">
                    <h2 id="create-test-title">Add Test / Quiz</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <fieldset disabled={saving} className="grading-modal-fieldset">
                        <div className="grading-modal-body">
                            <label htmlFor="testTitle">Activity Title</label>
                            <input
                                id="testTitle"
                                type="text"
                                placeholder="e.g. Quiz 1"
                                maxLength={200}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <label htmlFor="testTerm">Term</label>
                            <select
                                id="testTerm"
                                value={termTag}
                                onChange={(e) => setTermTag(e.target.value)}
                                required
                            >
                                <option value="Prelims">Prelims</option>
                                <option value="Midterms">Midterms</option>
                                <option value="Finals">Finals</option>
                            </select>

                            <label htmlFor="testComponent">
                                Grading Component
                            </label>
                            <select
                                id="testComponent"
                                value={componentTag}
                                onChange={(e) => setComponentTag(e.target.value)}
                                required
                            >
                                {components.map((component) => (
                                    <option
                                        key={component.name}
                                        value={component.name}
                                    >
                                        {component.name}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="testMaxScore">
                                Maximum Score
                            </label>
                            <input
                                id="testMaxScore"
                                type="number"
                                min="0.01"
                                step="any"
                                placeholder="e.g. 40"
                                value={maxScore}
                                onChange={(e) => setMaxScore(e.target.value)}
                                required
                            />

                            {error && (
                                <p
                                    role="alert"
                                    className="grading-modal-error"
                                >
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="grading-modal-footer">
                            <button type="button" onClick={onClose}>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="grading-modal-save"
                            >
                                {saving ? "Creating..." : "Create Activity"}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}