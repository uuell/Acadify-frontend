
export interface Teacher {
  id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  department: string;
}

export interface TeacherAcademicPeriod {
  current_school_year: string;
  current_semester: string;
}

export interface TeacherDashboardFilters {
  available_years: string[];
  selected_year: string;
  selected_semester: string;
}

export interface TeacherWeeklySchedule {
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
}

export interface TeacherDashboardStatistics {
  total_classes: number;
  total_students: number;
  weekly_schedule: TeacherWeeklySchedule;
}

export interface TeacherDashboardClass {
  id: number;
  subject_code: string;
  subject_name: string;
  section: string;
  units: number;
  room: string | null;
  schedule: string | null;
  student_count: number;
  ungraded_count: number;
}

export interface TeacherDashboardResponse {
  success: boolean;
  teacher: Teacher;
  academic_period: TeacherAcademicPeriod;
  filters: TeacherDashboardFilters;
  statistics: TeacherDashboardStatistics;
  classes: TeacherDashboardClass[];
}
