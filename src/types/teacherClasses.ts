
export interface TeacherClassAcademicPeriod {
  school_year: string;
  semester: string;
}

export interface TeacherClassEnrollment {
  capacity_percentage: number;
  count: number;
  max_students: number;
}

export interface TeacherClassGrading {
  can_edit_formula: boolean;
  completion_percentage: number;
  graded_count: number;
  has_formula: boolean;
  test_count: number;
  total_possible_grades: number;
}

export interface TeacherClass {
  id: number;
  name: string;
  code: string;
  section: string;
  units: number;
  room: string | null;
  schedule: string | null;
  academic_period: TeacherClassAcademicPeriod;
  enrollment: TeacherClassEnrollment;
  grading: TeacherClassGrading;
}

export interface TeacherClassesFilters {
  available_years: string[];
  selected_semester: string;
  selected_year: string;
}

export interface TeacherClassesResponse {
  success: boolean;
  classes: TeacherClass[];
  count: number;
  current_academic_period: TeacherClassAcademicPeriod;
  filters: TeacherClassesFilters;
}

export interface TeacherClassEditData {
  id: number;
  subject_name: string;
  subject_code: string;
  units: number;
  section: string;
  school_year: string;
  semester: string;
  schedule: string | null;
  room: string | null;
  max_students: number;
  grading_formula: {
    components: {
      name: string;
      weight: number;
    }[];
    use_philippine_conversion?: boolean;
  };
  enrollment_count: number;
  has_grades: boolean;
  can_edit_formula: boolean;
}

export interface TeacherClassEditResponse {
  success: boolean;
  class: TeacherClassEditData;
}