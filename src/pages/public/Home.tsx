
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Check,
  ChevronDown,
  CloudUpload,
  FileImage,
  GraduationCap,
  House,
  Layers,
  LogOut,
  MoreVertical,
  Search,
  Settings,
  SquarePen,
  UserRound,
  Zap,
} from "lucide-react";

import "./Home.css";

const samplePapers = [
  {
    filename: "alvarez.jpg",
    name: "Sofia Marie Alvarez",
    score: 27,
    match: 98,
    questions: [
      "1. Define a computer network.",
      "2. What is data transmission?",
      "3. Explain network protocols.",
    ],
  },
  {
    filename: "reyes.png",
    name: "Nathaniel Cruz Reyes",
    score: 25,
    match: 100,
    questions: [
      "1. What is digital communication?",
      "2. Describe a network topology.",
      "3. What is bandwidth?",
    ],
  },
];

function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: -300,
    y: -300,
  });

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="acadify-home">
      <div
        className="home-cursor-light"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
        aria-hidden="true"
      />

      {/* Navbar */}
      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          <GraduationCap size={26} />
          <span>Acadify</span>
        </Link>

        <div className="home-nav-buttons">
          <Link
            to="/student-login"
            className="home-btn home-btn-signin"
          >
            Student Login
          </Link>

          <Link
            to="/teacher-login"
            className="home-btn home-btn-register"
          >
            Teacher Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h2>Acadify</h2>

          <h1>
            Your modern school grading and monitoring system.
          </h1>

          <p>
            Simplify grading, manage student performance, and
            streamline academic workflows with intelligent tools.
          </p>

          <Link to="/about" className="home-btn home-btn-cta">
            About Acadify
          </Link>
        </div>

        {/* AI Grading Preview */}
        <div className="home-dashboard-preview">
          <div className="home-preview-app">
            {/* Sidebar */}
            <aside className="home-preview-sidebar">
              <div className="home-preview-logo">
                <GraduationCap size={19} />
                <span>Acadify</span>
              </div>

              <div className="home-preview-navigation">
                <div className="home-preview-group">
                  <span className="home-preview-label">
                    Management
                  </span>

                  <div className="home-preview-link">
                    <House size={16} />
                    <span>Dashboard</span>
                  </div>

                  <div className="home-preview-link">
                    <Layers size={16} />
                    <span>Classes</span>
                  </div>

                  <div className="home-preview-link">
                    <SquarePen size={16} />
                    <span>Grading</span>
                  </div>
                </div>

                <div className="home-preview-group">
                  <span className="home-preview-label">
                    AI Tools
                  </span>

                  <div className="home-preview-link active">
                    <Zap size={16} />
                    <span>AI Grading</span>
                  </div>
                </div>

                <div className="home-preview-group">
                  <span className="home-preview-label">
                    Insights
                  </span>

                  <div className="home-preview-link">
                    <Settings size={16} />
                    <span>Profile</span>
                  </div>
                </div>
              </div>

              <div className="home-preview-logout">
                <LogOut size={16} />
                <span>Logout</span>
              </div>
            </aside>

            {/* Main Content */}
            <div className="home-preview-main">
              <div className="home-ai-heading">
                <div className="home-ai-title">
                  <Zap size={19} />
                  <h3>AI Grading</h3>
                </div>

                <p>
                  Select a class and test, upload paper images,
                  then confirm each student's assignment.
                </p>
              </div>

              {/* Class and Test */}
              <div className="home-ai-selection">
                <h4>Select Class &amp; Test</h4>

                <div className="home-ai-fields">
                  <div className="home-ai-field">
                    <span>CLASS</span>

                    <div className="home-ai-select">
                      <span>BSIT 1A — 2026–2027</span>
                      <ChevronDown size={13} />
                    </div>
                  </div>

                  <div className="home-ai-field">
                    <span>TEST / ACTIVITY</span>

                    <div className="home-ai-select">
                      <span>Final Examination</span>
                      <ChevronDown size={13} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload */}
              <div className="home-ai-upload">
                <CloudUpload size={25} />

                <strong>
                  Drag &amp; drop paper images here
                </strong>

                <span>
                  JPG or PNG · Multiple files allowed
                </span>

                <div className="home-ai-upload-button">
                  Choose Files
                </div>
              </div>

              {/* Papers */}
              <div className="home-ai-papers-heading">
                <div className="home-ai-papers-title">
                  <h4>Uploaded Test Papers</h4>
                  <span>{samplePapers.length}</span>
                </div>

                <div className="home-ai-search">
                  <Search size={13} />
                  <span>Search student name...</span>
                </div>
              </div>

              <div className="home-ai-paper-grid">
                {samplePapers.map((paper) => (
                  <div
                    className="home-ai-paper-card"
                    key={paper.filename}
                  >
                    {/* Paper image recreated in CSS */}
                    <div className="home-ai-paper-image">
                      <div className="home-ai-paper-sheet">
                        <div className="home-ai-paper-header">
                          <span>ACADIFY UNIVERSITY</span>
                          <strong>FINAL EXAMINATION</strong>
                          <span>
                            Digital and Data Communication
                          </span>
                        </div>

                        <div className="home-ai-paper-student">
                          Name: {paper.name}
                        </div>

                        <div className="home-ai-paper-questions">
                          {paper.questions.map((question) => (
                            <div key={question}>
                              <span>{question}</span>
                              <div className="home-ai-paper-lines">
                                <i />
                                <i />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="home-ai-paper-score">
                          {paper.score}/30
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="home-ai-paper-details">
                      <div className="home-ai-paper-filename">
                        <FileImage size={12} />
                        <span>{paper.filename}</span>
                        <MoreVertical size={12} />
                      </div>

                      <div className="home-ai-paper-info">
                        <span>Name (OCR)</span>
                        <strong>{paper.name}</strong>
                      </div>

                      <div className="home-ai-paper-info">
                        <span>Score (OCR)</span>
                        <strong>{paper.score}/30</strong>
                      </div>

                      <div className="home-ai-paper-badges">
                        <span className="home-ai-assigned">
                          <Check size={10} />
                          Assigned
                        </span>

                        <span className="home-ai-match">
                          {paper.match}% match
                        </span>
                      </div>

                      <div className="home-ai-assigned-student">
                        <UserRound size={12} />
                        <span>{paper.name}</span>
                      </div>

                      <div className="home-ai-reassign">
                        <SquarePen size={11} />
                        Reassign
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="home-ai-bottom">
                <BookOpen size={12} />
                <span>
                  Review detected information before saving
                  grades.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-container">
          <div className="home-footer-content">
            <Link to="/" className="home-footer-logo">
              <GraduationCap size={24} />
              <span>Acadify</span>
            </Link>

            <div className="home-footer-links">
              <Link to="/about">About</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div className="home-footer-copyright">
            © {new Date().getFullYear()} Acadify. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
