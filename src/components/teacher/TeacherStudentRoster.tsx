
import { useMemo, useState } from "react";
import type { TeacherStudent } from "../../types/teacherStudents";

interface TeacherStudentRosterProps {
  students: TeacherStudent[];
  selectedStudentIds: number[];
  onSelectionChange: (ids: number[]) => void;
  maxStudents: number;
}

function TeacherStudentRoster({
  students,
  selectedStudentIds,
  onSelectionChange,
  maxStudents,
}: TeacherStudentRosterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student) =>
      [
        student.first_name,
        student.last_name,
        student.student_number,
        student.program,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [students, searchQuery]);

  function toggleStudent(studentId: number) {
    if (selectedStudentIds.includes(studentId)) {
      onSelectionChange(
        selectedStudentIds.filter((id) => id !== studentId),
      );
      return;
    }

    if (selectedStudentIds.length >= maxStudents) return;

    onSelectionChange([...selectedStudentIds, studentId]);
  }

  return (
    <section className="teacher-roster-builder">
      <div className="teacher-roster-heading">
        <h3>Student Roster</h3>
        <span>
          {selectedStudentIds.length}/{maxStudents} selected
        </span>
      </div>

      <p className="teacher-roster-description">
        Search and select students to enroll in this class.
      </p>

      <input
        type="search"
        className="teacher-class-form-input"
        placeholder="Search by name, student number, or program..."
        aria-label="Search students"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <div className="teacher-roster-student-list">
        {filteredStudents.length === 0 ? (
          <p className="teacher-roster-empty">
            No students found.
          </p>
        ) : (
          filteredStudents.map((student) => {
            const selected = selectedStudentIds.includes(student.id);
            const atCapacity =
              selectedStudentIds.length >= maxStudents;

            return (
              <label
                key={student.id}
                className={`teacher-roster-student ${
                  selected ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={!selected && atCapacity}
                  onChange={() => toggleStudent(student.id)}
                />

                <div className="teacher-roster-student-info">
                  <strong>
                    {student.last_name}, {student.first_name}
                  </strong>
                  <span>
                    {student.student_number} · {student.program}
                  </span>
                </div>
              </label>
            );
          })
        )}
      </div>

      {selectedStudentIds.length >= maxStudents && (
        <p className="teacher-roster-capacity-warning">
          Maximum class capacity reached.
        </p>
      )}
    </section>
  );
}

export default TeacherStudentRoster;
