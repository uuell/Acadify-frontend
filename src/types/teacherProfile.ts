export interface TeacherProfile {
  id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  department: string | null;
  specialization: string | null;
  created_at: string | null;
}

export interface TeacherProfileAcademicPeriod {
  school_year: string;
  semester: string;
}

export interface TeacherProfileStatistics {
  total_classes: number;
  current_students: number;
  total_grades_given: number;
  years_teaching: number;
}

export interface TeacherRecentActivity {
  grade_id: number;

  student: {
    id: number;
    student_number: string;
    first_name: string;
    last_name: string;
  };

  test: {
    id: number;
    title: string;
    term_tag: string;
    component_tag: string;
  };

  class: {
    id: number;
    subject_name: string;
    subject_code: string;
    section: string | null;
  };

  graded_at: string;
  time_ago: string;
}

export interface TeacherProfileResponse {
  success: boolean;
  teacher: TeacherProfile;
  academic_period: TeacherProfileAcademicPeriod;
  statistics: TeacherProfileStatistics;
  recent_activities: TeacherRecentActivity[];
}

export interface TeacherChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface TeacherChangePasswordResponse {
  success: boolean;
  message: string;
}