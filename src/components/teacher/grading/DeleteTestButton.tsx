
import { useState } from "react";
import { createPortal } from "react-dom";
import "./ScoreEntryModal.css";

interface DeleteTestButtonProps {
  testId: number;
  testTitle: string;
  deleting: boolean;
  onDelete: (testId: number) => void;
}

export default function DeleteTestButton({
  testId,
  testTitle,
  deleting,
  onDelete,
}: DeleteTestButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleConfirm() {
    if (deleting) return;

    setShowConfirm(false);
    onDelete(testId);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={deleting}
        title={`Delete ${testTitle}`}
        aria-label={`Delete ${testTitle}`}
        style={{
          background: "transparent",
          border: "none",
          color: "#f85149",
          cursor: deleting ? "not-allowed" : "pointer",
          fontSize: "14px",
          padding: "4px 6px",
        }}
      >
        {deleting ? "..." : "×"}
      </button>

      {showConfirm &&
        createPortal(
          <div
            className="grading-modal-overlay"
            onClick={() => {
              if (!deleting) setShowConfirm(false);
            }}
          >
            <div
              className="grading-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`delete-title-${testId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grading-modal-header">
                <h2 id={`delete-title-${testId}`}>
                  Delete Activity
                </h2>

                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="grading-modal-body">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{testTitle}</strong>?
                </p>

                <p style={{ color: "#f85149" }}>
                  This action cannot be undone.
                </p>
              </div>

              <div className="grading-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={deleting}
                  style={{
                    background: "#da3633",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "9px 16px",
                    cursor: deleting ? "not-allowed" : "pointer",
                  }}
                >
                  Delete Activity
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
