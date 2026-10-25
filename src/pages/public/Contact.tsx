
import { useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
} from "lucide-react";

import "./Contact.css";

type ContactFormData = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  inquiry_type: string;
  subject: string;
  message: string;
};

const initialFormData: ContactFormData = {
  first_name: "",
  last_name: "",
  email: "",
  role: "",
  inquiry_type: "",
  subject: "",
  message: "",
};

// Replace this with your personal email address
// when you're ready to publish it.
const CONTACT_EMAIL = "immanuelvista@gmail.com";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000").replace(/\/$/, "");
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "partnership", label: "School Partnership" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "privacy", label: "Privacy Inquiry" },
  { value: "other", label: "Other" },
];

function Contact() {
  const [formData, setFormData] =
    useState<ContactFormData>(initialFormData);

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error">("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  function updateField(
    field: keyof ContactFormData,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (notice) {
      setNotice("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!turnstileToken) {
      setNoticeType("error");
      setNotice("Please complete the security verification before sending.");
      return;
    }

    setIsSubmitting(true);
    setNotice("");

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstile_token: turnstileToken }),
      });

      const result: { success?: boolean; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (response.status === 429
              ? "Too many requests. Please try again later."
              : "Unable to send your message. Please try again."),
        );
      }

      setFormData({ ...initialFormData });
      setNoticeType("success");
      setNotice(result.message || "Your message was submitted successfully.");
    } catch (error) {
      setNoticeType("error");
      setNotice(
        error instanceof Error
          ? error.message
          : "A network error occurred. Please try again later.",
      );
    } finally {
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setIsSubmitting(false);
    }
  }

  return (
    <div className="acadify-contact">
      {/* Navbar */}
      <nav className="contact-navbar">
        <Link to="/" className="contact-logo">
          <GraduationCap size={22} />
          <span>Acadify</span>
        </Link>

        <div className="contact-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact" className="active">
            Contact
          </Link>
        </div>

        <Link
          to="/student-login"
          className="contact-nav-btn"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="contact-page-hero">
        <span className="contact-eyebrow">
          Get in Touch
        </span>

        <h1>Contact Us</h1>

        <p>
          Have a question about Acadify, interested in
          exploring its features, or want to share
          feedback? Get in touch with the Acadify
          Development Team.
        </p>
      </section>

      {/* Main Content */}
      <main className="contact-wrap">
        {/* Contact Information */}
        <div className="contact-info-col">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Mail size={18} />
            </div>

            <div className="contact-info-text">
              <h3>Email the Development Team</h3>

              {CONTACT_EMAIL ? (
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              ) : (
                <p>
                  Contact email will be available soon.
                </p>
              )}

              <p>
                For project inquiries, technical
                questions, and general assistance.
              </p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <MessageSquare size={18} />
            </div>

            <div className="contact-info-text">
              <h3>Project Feedback</h3>

              <p>
                Share suggestions, report issues, or
                tell us how Acadify could better support
                academic grading and student performance
                management.
              </p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <GraduationCap size={18} />
            </div>

            <div className="contact-info-text">
              <h3>Institutional Inquiries</h3>

              <p>
                Interested in exploring Acadify for
                your school? Contact our development
                team to learn more about the project
                and its planned capabilities.
              </p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <ShieldCheck size={18} />
            </div>

            <div className="contact-info-text">
              <h3>Privacy & Data Concerns</h3>

              <p>
                For questions about personal
                information, academic records,
                or data handling during project
                development and testing, please
                contact the development team.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          <h2>Send a Message</h2>

          {notice && (
            <div
              className={`contact-alert ${noticeType === "success" ? "contact-alert-success" : "contact-alert-error"}`}
              role="status"
            >
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="contact-first-name">
                  First Name *
                </label>

                <input
                  id="contact-first-name"
                  type="text"
                  name="first_name"
                  placeholder="Juan"
                  autoComplete="given-name"
                  maxLength={100}
                  value={formData.first_name}
                  onChange={(event) =>
                    updateField(
                      "first_name",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-last-name">
                  Last Name *
                </label>

                <input
                  id="contact-last-name"
                  type="text"
                  name="last_name"
                  placeholder="Dela Cruz"
                  autoComplete="family-name"
                  maxLength={100}
                  value={formData.last_name}
                  onChange={(event) =>
                    updateField(
                      "last_name",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-email">
                Email Address *
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                value={formData.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-role">
                Your Role
              </label>

              <select
                id="contact-role"
                name="role"
                value={formData.role}
                onChange={(event) =>
                  updateField(
                    "role",
                    event.target.value
                  )
                }
              >
                <option value="">
                  — Select your role —
                </option>

                <option value="student">
                  Student
                </option>

                <option value="teacher">
                  Teacher / Faculty
                </option>

                <option value="admin">
                  School Administrator
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-inquiry-type">
                Inquiry Type *
              </label>

              <select
                id="contact-inquiry-type"
                name="inquiry_type"
                value={formData.inquiry_type}
                onChange={(event) =>
                  updateField(
                    "inquiry_type",
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  — Select inquiry type —
                </option>

                {inquiryTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-subject">
                Subject *
              </label>

              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="Briefly describe your inquiry"
                maxLength={150}
                value={formData.subject}
                onChange={(event) =>
                  updateField(
                    "subject",
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-message">
                Message *
              </label>

              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us more about your question, suggestion, or concern..."
                maxLength={5000}
                value={formData.message}
                onChange={(event) =>
                  updateField(
                    "message",
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="contact-form-group">
              {TURNSTILE_SITE_KEY ? (
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => {
                    setTurnstileToken(token);
                    setNotice("");
                  }}
                  onExpire={() => setTurnstileToken(null)}
                  onError={() => {
                    setTurnstileToken(null);
                    setNoticeType("error");
                    setNotice("Security verification failed to load. Please try again.");
                  }}
                  options={{ theme: "auto" }}
                />
              ) : (
                <p role="alert">Security verification is not configured.</p>
              )}
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={isSubmitting || !turnstileToken || !TURNSTILE_SITE_KEY}
            >
              <Send size={17} />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            <p
              style={{
                marginTop: "1rem",
                color: "#9ca3af",
                fontSize: "0.78rem",
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              Please avoid including passwords or sensitive academic
              information in your message.
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="contact-footer-inner">
          <Link
            to="/"
            className="contact-footer-logo"
          >
            <GraduationCap size={18} />
            <span>Acadify</span>
          </Link>

          <div className="contact-footer-nav">
            <Link to="/about">About</Link>
            <Link to="/privacy">
              Privacy Policy
            </Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <p className="contact-footer-copy">
          © {new Date().getFullYear()} Acadify™.
          All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default Contact;
