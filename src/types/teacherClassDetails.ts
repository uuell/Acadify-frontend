export interface TeacherClassDetailsData {
  id: number;
  subject_name: string;
  subject_code: string;
  section: string | null;
  school_year: string;
  semester: string;
  units: number;
  schedule: string | null;
  room: string | null;
  max_students: number;
  enrollment_count?: number;
  graded_students_count?: number;
}

export interface TeacherClassDetailsResponse {
  success: boolean;
  class: TeacherClassDetailsData;
  students: TeacherClassStudent[];
}

export interface TeacherClassStudent {
  id: number;
  first_name: string;
  last_name: string;
  student_number: string;
  graded_activities: number;
  enrollment: {
    id: number;
    final_grade: number | null;
    grade_display: string;
    status: string;
  };
}