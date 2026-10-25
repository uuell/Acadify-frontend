import type { StudentGPAValues } from "../../types/student";

interface GPASummaryCardsProps {
  semesterGPA: StudentGPAValues;
  cumulativeGPA: StudentGPAValues;
}

function GPASummaryCards({
  semesterGPA,
  cumulativeGPA,
}: GPASummaryCardsProps) {
  const formatGPA = (value: number | null) =>
    value != null ? value.toFixed(2) : "—";

  const sections = [
    {
      title: "Semester GPA",
      values: semesterGPA,
      type: "semester",
    },
    {
      title: "Cumulative GPA",
      values: cumulativeGPA,
      type: "cumulative",
    },
  ];

  return (
    <section className="student-gpa-summary">
      {sections.map((section) => (
        <div className="student-gpa-summary-section" key={section.type}>
          <h2>{section.title}</h2>

          <div className="student-gpa-cards">
            <div className="student-gpa-card">
              <p>Weighted GPA</p>
              <strong>{formatGPA(section.values.weighted)}</strong>
            </div>

            <div className="student-gpa-card">
              <p>Simple GPA</p>
              <strong>{formatGPA(section.values.simple)}</strong>
            </div>

            <div className="student-gpa-card">
              <p>Major-Only GPA</p>
              <strong>{formatGPA(section.values.major_only)}</strong>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default GPASummaryCards;