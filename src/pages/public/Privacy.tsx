
import { Link } from "react-router-dom";
import { CalendarDays, GraduationCap } from "lucide-react";

import "./Privacy.css";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "data-collected", label: "Data We Collect" },
  { id: "data-use", label: "How We Use It" },
  { id: "data-storage", label: "Storage & Security" },
  { id: "sharing", label: "Data Sharing" },
  { id: "rights", label: "Your Rights" },
  { id: "cookies", label: "Cookies & Sessions" },
  { id: "changes", label: "Policy Changes" },
  { id: "contact", label: "Contact Us" },
];

function Privacy() {
  return (
    <div className="acadify-privacy">
      {/* Navbar */}
      <nav className="privacy-navbar">
        <Link to="/" className="privacy-logo">
          <GraduationCap size={22} />
          <span>Acadify</span>
        </Link>

        <div className="privacy-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy" className="active">
            Privacy
          </Link>
          <Link to="/contact">Contact</Link>
        </div>

        <Link to="/student-login" className="privacy-nav-btn">
          Sign In
        </Link>
      </nav>

      <div className="privacy-page-wrap">
        {/* Table of Contents */}
        <aside className="privacy-toc">
          <p className="privacy-toc-title">
            On This Page
          </p>

          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Privacy Policy Content */}
        <main className="privacy-document">
          <header className="privacy-doc-header">
            <span className="privacy-eyebrow">
              Legal
            </span>

            <h1>Privacy Policy</h1>

            <p>
              This Privacy Policy explains how Acadify
              handles personal information, academic
              records, and other data during its
              development, demonstration, and evaluation.
            </p>

            <div className="privacy-updated-badge">
              <CalendarDays size={15} />
              Last updated: <span>October 2026</span>
            </div>
          </header>

          {/* 1. Overview */}
          <section
            className="privacy-doc-section"
            id="overview"
          >
            <h2>Overview</h2>

            <p>
              Acadify is a student-developed academic
              grading and performance management platform
              created as a thesis project. It is designed
              to help educational institutions simplify
              grade management, monitor academic progress,
              and organize academic records through a
              centralized system.
            </p>

            <p>
              Acadify is currently intended for development,
              demonstration, and evaluation purposes. It has
              not been officially adopted or deployed by any
              educational institution.
            </p>

            <p>
              This Privacy Policy describes the information
              that may be processed when using Acadify, how
              that information supports the system's
              functionality, and the measures intended to
              protect user information.
            </p>

            <p>
              We aim to handle personal information
              responsibly and in accordance with applicable
              Philippine data privacy requirements,
              including Republic Act No. 10173, also known
              as the Data Privacy Act of 2012.
            </p>
          </section>

          {/* 2. Data We Collect */}
          <section
            className="privacy-doc-section"
            id="data-collected"
          >
            <h2>Data We Collect</h2>

            <p>
              Acadify processes information necessary to
              demonstrate and support its academic grading
              and student performance management features.
              Depending on the user role and available
              functionality, this information may include:
            </p>

            <ul>
              <li>
                <strong>Account Information:</strong>{" "}
                Login identifiers, email addresses where
                provided, password hashes, and assigned
                user roles.
              </li>

              <li>
                <strong>Student Information:</strong>{" "}
                Student numbers, names, academic programs,
                departments, year levels, sections, and
                other relevant enrollment details.
              </li>

              <li>
                <strong>Teacher Information:</strong>{" "}
                Employee numbers, names, departments,
                and information associated with teaching
                assignments.
              </li>

              <li>
                <strong>Academic Records:</strong>{" "}
                Subjects, classes, enrollments, assessment
                records, scores, grading components,
                calculated grades, and related academic
                information.
              </li>

              <li>
                <strong>Uploaded Assessment Files:</strong>{" "}
                Images or documents submitted for
                AI-assisted grading and optical character
                recognition (OCR), when those features
                are enabled.
              </li>

              <li>
                <strong>System Information:</strong>{" "}
                Account creation dates, record timestamps,
                authentication information, and technical
                information needed to operate or
                troubleshoot the application.
              </li>
            </ul>

            <p>
              During development and demonstration,
              Acadify may use sample or test records to
              illustrate its functionality. If actual
              personal information is used during testing,
              it should be collected and processed only
              with an appropriate legal basis and
              necessary safeguards.
            </p>

            <div className="privacy-highlight-box">
              <strong>Data Minimization:</strong>{" "}
              Acadify is designed to process information
              relevant to academic management. Users
              should avoid entering unnecessary sensitive
              personal information or uploading real
              student records unless their use has been
              appropriately authorized.
            </div>
          </section>

          {/* 3. How We Use It */}
          <section
            className="privacy-doc-section"
            id="data-use"
          >
            <h2>How We Use It</h2>

            <p>
              Information processed through Acadify
              supports the operation, testing, and
              evaluation of its academic management
              features. These purposes may include:
            </p>

            <ul>
              <li>
                Authenticating users and providing
                access to features based on their
                assigned roles.
              </li>

              <li>
                Managing student and teacher profiles,
                class assignments, and enrollments.
              </li>

              <li>
                Recording assessment results and
                calculating term grades, academic
                averages, and other grade-related
                information.
              </li>

              <li>
                Allowing students to view available
                academic records and monitor their
                academic progress.
              </li>

              <li>
                Generating grade reports and exporting
                academic information for review and
                record management.
              </li>

              <li>
                Supporting AI-assisted grading workflows,
                including the extraction and review of
                information from assessment materials,
                where implemented and enabled.
              </li>

              <li>
                Testing, maintaining, troubleshooting,
                and improving the system during
                development and evaluation.
              </li>
            </ul>

            <p>
              Acadify is intended for educational and
              academic management purposes. Personal
              information should not be used for
              unrelated purposes without an appropriate
              legal basis and, where required, additional
              notice or consent.
            </p>
          </section>

          {/* 4. Storage & Security */}
          <section
            className="privacy-doc-section"
            id="data-storage"
          >
            <h2>Storage &amp; Security</h2>

            <p>
              Acadify uses a database-backed application
              architecture to manage account information,
              academic records, and other system data.
              The project incorporates security measures
              intended to reduce unauthorized access and
              protect information processed through the
              platform.
            </p>

            <p>
              These measures include:
            </p>

            <ul>
              <li>
                <strong>Password Protection:</strong>{" "}
                User passwords are processed using
                BCrypt hashing rather than being stored
                as readable plaintext.
              </li>

              <li>
                <strong>Authentication:</strong>{" "}
                Users must authenticate to access
                protected application features.
              </li>

              <li>
                <strong>Role-Based Permissions:</strong>{" "}
                Access to academic functions and
                records is controlled according to
                the permissions assigned to
                administrators, teachers, and students.
              </li>

              <li>
                <strong>Session Management:</strong>{" "}
                The application uses session-based
                authentication to maintain signed-in
                user sessions.
              </li>

              <li>
                <strong>Deployment Security:</strong>{" "}
                Security settings, encrypted connections,
                and access restrictions depend on the
                configuration of the environment in
                which the application is deployed.
              </li>
            </ul>

            <p>
              Files uploaded for assessment processing
              may be stored or processed by the
              application as required by the enabled
              workflow. File handling, retention, and
              deletion procedures must be reviewed
              before real institutional records are
              processed.
            </p>

            <p>
              Although Acadify is developed with data
              protection in mind, no application or
              storage system can guarantee absolute
              security. Additional security testing,
              operational controls, and institutional
              policies would be necessary before
              production adoption.
            </p>
          </section>

          {/* 5. Data Sharing */}
          <section
            className="privacy-doc-section"
            id="sharing"
          >
            <h2>Data Sharing</h2>

            <p>
              Acadify is not designed to sell personal
              information or use academic records for
              advertising purposes.
            </p>

            <p>
              Depending on how the application is
              deployed and configured, information
              may be accessible to or processed by
              the following parties when necessary:
            </p>

            <ul>
              <li>
                <strong>Authorized Users:</strong>{" "}
                Administrators, teachers, and students
                may access information appropriate
                to their assigned roles.
              </li>

              <li>
                <strong>Service Providers:</strong>{" "}
                Hosting, database, storage, or other
                technical service providers may process
                information needed to operate the
                application.
              </li>

              <li>
                <strong>Authorized Project Personnel:</strong>{" "}
                Members of the development team may
                require limited access to test data
                for development, troubleshooting,
                and evaluation.
              </li>

              <li>
                <strong>Legal Requirements:</strong>{" "}
                Information may be disclosed when
                required by applicable law or a
                valid legal process.
              </li>
            </ul>

            <p>
              If Acadify is adopted by an educational
              institution in the future, the institution
              and the project team will need to establish
              appropriate responsibilities, access
              controls, and data processing arrangements
              before handling institutional records.
            </p>
          </section>

          {/* 6. Your Rights */}
          <section
            className="privacy-doc-section"
            id="rights"
          >
            <h2>Your Rights</h2>

            <p>
              Under the Philippine Data Privacy Act
              of 2012 and applicable regulations,
              individuals have rights concerning
              the processing of their personal
              information, subject to legal
              requirements and limitations.
            </p>

            <p>
              These rights may include:
            </p>

            <ul>
              <li>
                <strong>Right to Be Informed:</strong>{" "}
                Know how and why personal information
                is collected and processed.
              </li>

              <li>
                <strong>Right of Access:</strong>{" "}
                Request access to personal information
                held about you.
              </li>

              <li>
                <strong>Right to Rectification:</strong>{" "}
                Request correction of inaccurate or
                incomplete personal information.
              </li>

              <li>
                <strong>Right to Erasure or Blocking:</strong>{" "}
                Request deletion, removal, or blocking
                of personal information in circumstances
                permitted by law.
              </li>

              <li>
                <strong>Right to Object:</strong>{" "}
                Object to certain processing activities
                where applicable.
              </li>

              <li>
                <strong>Right to Data Portability:</strong>{" "}
                Request a copy of eligible personal
                information in an appropriate format,
                subject to applicable requirements.
              </li>

              <li>
                <strong>Right to File a Complaint:</strong>{" "}
                Raise concerns with the appropriate
                organization or the National Privacy
                Commission.
              </li>
            </ul>

            <p>
              Individuals may also have other rights
              and remedies under applicable privacy
              laws, including the right to damages
              in qualifying circumstances.
            </p>

            <p>
              For questions or requests concerning
              personal information processed during
              Acadify's development and testing,
              please use the contact information
              provided on this website.
            </p>
          </section>

          {/* 7. Cookies & Sessions */}
          <section
            className="privacy-doc-section"
            id="cookies"
          >
            <h2>Cookies &amp; Sessions</h2>

            <p>
              Acadify uses session-based authentication
              to maintain user login sessions and
              support access to protected features.
            </p>

            <p>
              Authentication-related cookies may be
              used to recognize an active session
              between requests.
            </p>

            <ul>
              <li>
                Session cookies support user
                authentication and access to
                protected application functions.
              </li>

              <li>
                Cookie security attributes, including
                HTTP-only, Secure, and SameSite
                settings, depend on the application's
                deployment configuration.
              </li>

              <li>
                Session expiration and persistence
                depend on the application's
                authentication and session settings.
              </li>

              <li>
                Signing out is intended to end
                the user's authenticated session.
              </li>
            </ul>

            <p>
              Any additional analytics or third-party
              cookies introduced in future versions
              should be disclosed in an updated
              privacy notice.
            </p>
          </section>

          {/* 8. Policy Changes */}
          <section
            className="privacy-doc-section"
            id="changes"
          >
            <h2>Policy Changes</h2>

            <p>
              This Privacy Policy may be updated as
              Acadify continues to develop, introduces
              new features, or changes its data
              processing practices.
            </p>

            <p>
              When material changes are made, the
              revised policy will be published on
              this page with an updated revision
              date. Additional notice or consent
              will be provided where required
              by applicable law.
            </p>

            <p>
              If Acadify is adopted by an educational
              institution, the privacy notice may
              need to be revised to reflect the
              institution's responsibilities,
              processing activities, and applicable
              data protection policies.
            </p>
          </section>

          {/* 9. Contact Us */}
          <section
            className="privacy-doc-section"
            id="contact"
          >
            <h2>Contact Us</h2>

            <p>
              If you have questions about this
              Privacy Policy, the information
              processed by Acadify, or the handling
              of data during development and
              demonstration, please contact the
              Acadify project team.
            </p>

            <div className="privacy-highlight-box">
              <strong>
                Acadify Development Team
              </strong>

              <p>
                Student-Developed Thesis Project
              </p>

              <p>
                University of Rizal System — Morong
              </p>

              <p>
                For inquiries, please visit our{" "}
                <Link to="/contact">
                  Contact Page
                </Link>
                .
              </p>
            </div>

            <p>
              Acadify is an independent academic
              development project and is not
              currently operated as an official
              grading system by the university
              or any other educational institution.
            </p>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="privacy-footer">
        <div className="privacy-footer-inner">
          <Link
            to="/"
            className="privacy-footer-logo"
          >
            <GraduationCap size={18} />
            <span>Acadify</span>
          </Link>

          <div className="privacy-footer-nav">
            <Link to="/about">About</Link>
            <Link to="/privacy">
              Privacy Policy
            </Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <p className="privacy-footer-copy">
          © {new Date().getFullYear()} Acadify™.
          All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default Privacy;
