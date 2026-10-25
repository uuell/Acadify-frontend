import { useState } from "react";

interface GradingExportDropdownProps {
  classId: number;
  onExport: (format: "csv" | "xlsx") => void;
}

export default function GradingExportDropdown({
  classId,
  onExport,
}: GradingExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        disabled={!classId}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Export ▾
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "6px",
            minWidth: "180px",
            padding: "6px",
            background: "#21262d",
            border: "1px solid #30363d",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
            zIndex: 100,
          }}
        >
          <button
            type="button"
            onClick={() => {
              onExport("csv");
              setIsOpen(false);
            }}
            style={{ width: "100%", textAlign: "left" }}
          >
            Export as CSV
          </button>

          <button
            type="button"
            onClick={() => {
              onExport("xlsx");
              setIsOpen(false);
            }}
            style={{ width: "100%", textAlign: "left" }}
          >
            Export as Excel (.xlsx)
          </button>
        </div>
      )}
    </div>
  );
}