import { useEffect } from "react";

interface TeacherDeleteClassModalProps {
  className: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  error: string;
}

function TeacherDeleteClassModal({
  className,
  onClose,
  onConfirm,
  isDeleting,
  error,
}: TeacherDeleteClassModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, isDeleting]);

  return (
    <div
      className="teacher-class-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        className="teacher-delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="teacher-delete-modal-title"
        aria-describedby="teacher-delete-modal-description"
      >
        <h2 id="teacher-delete-modal-title">Delete Class</h2>

        <p id="teacher-delete-modal-description">
          Are you sure you want to delete{" "}
          <strong>{className}</strong>?
        </p>

        <p className="teacher-delete-warning">
          This action cannot be undone. All enrollments, tests,
          and grades associated with this class will be
          permanently deleted.
        </p>

        {error && (
          <p className="teacher-grading-error" role="alert">
            {error}
          </p>
        )}

        <div className="teacher-class-modal-footer">
          <button
            type="button"
            className="teacher-class-modal-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="teacher-delete-confirm-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Class"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherDeleteClassModal;