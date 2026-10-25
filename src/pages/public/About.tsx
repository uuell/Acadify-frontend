
import { Link } from "react-router-dom";
import {
  BarChart3,
  Calculator,
  Download,
  GraduationCap,
  LockKeyhole,
  Users,
  Zap,
} from "lucide-react";

import "./About.css";

const features = [
  {
    title: "Real-Time Grade Updates",
    description:
      "Students can access their academic records and view updated grades as they become available, helping them stay informed about their progress throughout the semester.",
    icon: BarChart3,
  },
  {
    title: "AI-Assisted Grading",
    description:
      "Reduce repetitive grading tasks with AI-assisted tools that extract student information and scores from uploaded assessment papers, helping teachers organize and process results more efficiently.",
    icon: Zap,
  },
  {
    title: "Role-Based Access",
    description:
      "Provide students, teachers, and administrators with dedicated dashboards and tools tailored to their responsibilities within the institution.",
    icon: Users,
  },
  {
    title: "GPA Calculator",
    description:
      "Help students understand their academic standing and plan ahead with a GPA calculator that uses their enrolled subjects and grade information.",
    icon: Calculator,
  },
  {
    title: "Grade Reports & Export",
    description:
      "Generate organized academic reports and export grade records for documentation, review, and institutional reporting.",
    icon: Download,
  },
  {
    title: "Secure Academic Records",
    description:
      "Protect sensitive academic information through password hashing, authenticated access, and role-based permissions designed to keep records accessible only to authorized users.",
    icon: LockKeyhole,
  },
];

function About() {
  return (
    <div className="acadify-about">
      {/* Navbar */}
      <nav className="about-navbar">
        <Link to="/" className="about-logo">
          <GraduationCap size={22} />
          <span>Acadify</span>
        </Link>

        <div className="about-nav-links">
          <Link to="/">Home</Link>

          <Link to="/about" className="active">
            About
          </Link>

          <Link to="/privacy">Privacy</Link>

          <Link to="/contact">Contact</Link>
        </div>

        <Link
          to="/student-login"
          className="about-nav-btn"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="about-hero">
        <span className="about-eyebrow">
          About Acadify
        </span>

        <h1>
          Built for educators,
          <br />
          <span>designed for results</span>
        </h1>

        <p>
          Acadify is an academic grading and student
          performance management platform designed to
          simplify how educational institutions manage
          grades, monitor academic progress, and connect
          teachers, students, and administrators in one
          centralized system.
        </p>

        <div className="about-divider" />
      </section>

      {/* Main Content */}
      <main className="about-content">
        {/* Mission */}
        <section className="about-section">
          <h2>
            <span className="about-section-num">
              01
            </span>
            Our Mission
          </h2>

          <p>
            Managing academic records should be simple,
            accurate, and efficient. Yet traditional
            grading processes often involve repetitive
            tasks, scattered records, and unnecessary
            administrative work.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Our mission is to make academic management
            easier through a centralized platform that
            streamlines grading, improves access to
            academic information, and helps educators
            focus more on teaching and student
            development.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Designed with Philippine higher education
            in mind, Acadify supports familiar academic
            workflows, grading structures, and
            semester-based record management.
          </p>
        </section>

        {/* Features */}
        <div className="about-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="about-feature-card"
                key={feature.title}
              >
                <div className="about-feature-icon">
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                  />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>

        {/* Audience */}
        <section className="about-section">
          <h2>
            <span className="about-section-num">
              02
            </span>
            Who It's For
          </h2>

          <p>
            Acadify is designed for Philippine colleges
            and universities seeking a more efficient
            way to manage academic records and grading
            workflows.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Built around semester-based academic
            structures and the familiar 1.0–5.0
            grading scale, the platform brings
            together essential tools for students,
            teachers, and administrators.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Whether managing individual classes or
            coordinating academic records across
            departments, Acadify provides a centralized
            environment for organizing grades,
            monitoring progress, and simplifying
            everyday academic tasks.
          </p>
        </section>

        {/* Team */}
        <section className="about-section">
          <h2>
            <span className="about-section-num">
              03
            </span>
            The Team
          </h2>

          <p>
            Acadify is a student-developed initiative
            created to address the challenges of
            traditional academic record management.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Developed with the needs of Philippine
            higher education in mind, the project
            combines software development, automation,
            and practical academic workflows to make
            grading and student performance monitoring
            more accessible and efficient.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Our goal is to build technology that
            supports educators, empowers students,
            and contributes to a more organized
            academic experience.
          </p>

          <div className="about-team-note">
            <strong>
              University of Rizal System — Morong
            </strong>

            Developed as a student-led academic
            initiative, Acadify is inspired by the
            grading workflows and academic record
            management needs of Philippine higher
            education institutions.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-inner">
          <Link
            to="/"
            className="about-footer-logo"
          >
            <GraduationCap size={18} />
            <span>Acadify</span>
          </Link>

          <div className="about-footer-nav">
            <Link to="/about">About</Link>

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/contact">
              Contact
            </Link>
          </div>
        </div>

        <p className="about-footer-copy">
          © {new Date().getFullYear()} Acadify™.
          All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default About;
