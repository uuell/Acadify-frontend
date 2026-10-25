
export interface TeacherStudent {
  id: number;
  student_number: string;
  first_name: string;
  last_name: string;
  program: string;
  department: string;
  section: string;
  year_level: string;
}

export interface TeacherStudentsResponse {
  success: boolean;
  count: number;
  students: TeacherStudent[];
  filters: {
    class_id: number | null;
    department: string | null;
    program: string | null;
    search: string | null;
  };
}

export interface TeacherEnrolledStudentsResponse {
  success: boolean;
  class_id: number;
  students: TeacherStudent[];
  count: number;
}