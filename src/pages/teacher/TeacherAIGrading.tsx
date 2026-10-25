
import { useEffect, useRef, useState } from "react";
import { BookOpen, FileImage, UploadCloud, X, Zap } from "lucide-react";
import "./TeacherAIGrading.css";

type SelectedPaper = {
  id: string;
  file: File;
  previewUrl: string;
};

export default function TeacherAIGrading() {
  const [semester, setSemester] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [papers, setPapers] = useState<SelectedPaper[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const papersRef = useRef<SelectedPaper[]>([]);

  useEffect(() => {
    papersRef.current = papers;
  }, [papers]);

  useEffect(() => {
    return () => {
      papersRef.current.forEach((paper) => {
        URL.revokeObjectURL(paper.previewUrl);
      });
    };
  }, []);

  function handleFiles(files: FileList | File[]) {
    const validFiles = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    if (validFiles.length === 0) {
      return;
    }

    const newPapers = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPapers((previous) => [...previous, ...newPapers]);
  }

  function removePaper(id: string) {
    setPapers((previous) => {
      const paper = previous.find((item) => item.id === id);

      if (paper) {
        URL.revokeObjectURL(paper.previewUrl);
      }

      return previous.filter((item) => item.id !== id);
    });
  }

  return (
    <div className="teacher-ai-grading">
      <header className="ai-grading-page-header">
        <div className="ai-grading-heading">
          <Zap size={26} />
          <h1>AI Grading</h1>
        </div>
        <p>
          Select a class and test, upload paper images, then review the
          results.
        </p>
      </header>

      <section className="ai-grading-picker-card">
        <h2>Select Class &amp; Test</h2>

        <div className="ai-grading-filter-grid">
          <div className="ai-grading-field">
            <label htmlFor="ai-semester">Semester</label>
            <select
              id="ai-semester"
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="Summer">Summer</option>
            </select>
          </div>

          <div className="ai-grading-field">
            <label htmlFor="ai-school-year">School Year</label>
            <select
              id="ai-school-year"
              value={schoolYear}
              onChange={(event) => setSchoolYear(event.target.value)}
            >
              <option value="">All Years</option>
            </select>
          </div>
        </div>

        <div className="ai-grading-picker-grid">
          <div className="ai-grading-field">
            <label htmlFor="ai-class">Class</label>
            <select
              id="ai-class"
              value={selectedClass}
              onChange={(event) => {
                setSelectedClass(event.target.value);
                setSelectedTest("");
              }}
            >
              <option value="">— Select class —</option>
            </select>
          </div>

          <div className="ai-grading-field">
            <label htmlFor="ai-test">Test / Activity</label>
            <select
              id="ai-test"
              value={selectedTest}
              onChange={(event) => setSelectedTest(event.target.value)}
              disabled={!selectedClass}
            >
              <option value="">— Select class first —</option>
            </select>
          </div>
        </div>

        <p className="ai-grading-placeholder-note">
          <BookOpen size={15} />
          Class and test data will be connected later.
        </p>
      </section>

      <section className="ai-grading-upload-card">
        <div className="ai-grading-section-heading">
          <h2>Upload Test Papers</h2>
          <span>Frontend preview</span>
        </div>

        <div
          className={`ai-grading-dropzone ${
            isDragging ? "dragging" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
        >
          <UploadCloud size={38} />

          <h3>Drag &amp; drop paper images here</h3>
          <p>JPG or PNG · Multiple files allowed</p>

          <button
            type="button"
            className="ai-grading-choose-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) {
                handleFiles(event.target.files);
              }
              event.target.value = "";
            }}
          />
        </div>

        <p className="ai-grading-upload-note">
          Images are previewed locally. No files are uploaded or processed
          by AI yet.
        </p>
      </section>

      <section className="ai-grading-papers-section">
        <div className="ai-grading-section-heading">
          <h2>Selected Papers</h2>
          <span>{papers.length} image(s)</span>
        </div>

        {papers.length === 0 ? (
          <div className="ai-grading-empty-state">
            <FileImage size={34} />
            <p>No papers selected yet.</p>
          </div>
        ) : (
          <div className="ai-grading-papers-grid">
            {papers.map((paper) => (
              <article className="ai-grading-paper-card" key={paper.id}>
                <div className="ai-grading-paper-image">
                  <img
                    src={paper.previewUrl}
                    alt={paper.file.name}
                  />
                </div>

                <div className="ai-grading-paper-details">
                  <span title={paper.file.name}>
                    {paper.file.name}
                  </span>

                  <button
                    type="button"
                    aria-label={`Remove ${paper.file.name}`}
                    onClick={() => removePaper(paper.id)}
                  >
                    <X size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
