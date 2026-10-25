import { useState } from "react";
import type { FormEvent } from "react";
import "./ScoreEntryModal.css";

interface ScoreEntryModalProps {
  studentName: string;
  testTitle: string;
  initialRawScore: number | null;
  maxScore: number;
  saving: boolean;
  onClose: () => void;
  onSave: (rawScore: number) => void;
}

export default function ScoreEntryModal({
  studentName,
  testTitle,
  initialRawScore,
  maxScore,
  saving,
  onClose,
  onSave,
}: ScoreEntryModalProps) {
  const [rawScore, setRawScore] = useState(
    initialRawScore?.toString() ?? ""
  );

  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (saving) return;

    const score = Number(rawScore);

    if (
      rawScore.trim() === "" ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > maxScore
    ) {
      setError(`Raw score must be between 0 and ${maxScore}.`);
      return;
    }

    setError("");
    onSave(score);
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
        aria-labelledby="score-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grading-modal-header">
          <h2 id="score-modal-title">Enter Score</h2>

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
          <div className="grading-modal-body">
            <p>
              <strong>Student:</strong> {studentName}
            </p>

            <p>
              <strong>Activity:</strong> {testTitle}
            </p>

            <label htmlFor="rawScore">Raw Score</label>

            <input
              id="rawScore"
              type="number"
              min="0"
              max={maxScore}
              step="any"
              value={rawScore}
              disabled={saving}
              onChange={(e) => {
                setRawScore(e.target.value);
                setError("");
              }}
              required
              autoFocus
            />

            <p>
              <strong>Maximum Score:</strong> {maxScore}
            </p>

            {error && (
              <p role="alert" className="grading-modal-error">
                {error}
              </p>
            )}
          </div>

          <div className="grading-modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="grading-modal-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Score"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}