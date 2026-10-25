export interface StudentProfile {
  id: number;
  first_name: string;
  last_name: string;
  student_number: string;
  department: string;
  program: string;
  section: string | null;
  year_level: string;
}

export interface AcademicPeriod {
  current_school_year: string;
  current_semester: string;
  selected_year: string;
  selected_semester: string;
}

export interface StudentClass {
  id: number;
  school_year: string;
  semester: string;
  subject_code: string;
  subject_name: string;
  units: number;
}

export interface StudentEnrollment {
  id: number;
  class_id: number;
  student_id: number;
  enrollment_date: string;
  final_grade: number | null;
  status: string;
}

export interface StudentRecentGrade {
  id: number;
  test_id: number;
  raw_score: number;
  max_score: number;
  calculated_percentage: number | null;
  graded_at: string | null;
}

export interface StudentGPA {
  semester_weighted: number | null;
  semester_simple: number | null;
  cumulative_weighted: number | null;
}

export interface StudentStats {
  total_units: number;
  graded_count: number;
  total_count: number;
}

export interface AcademicStanding {
  standing: string;
  color: string;
}

export interface StudentDashboardResponse {
  student: StudentProfile;
  period: AcademicPeriod;
  available_years: string[];
  enrolled_classes: StudentClass[];
  enrollment_map: Record<string, StudentEnrollment>;
  recent_grades: StudentRecentGrade[];
  gpa: StudentGPA;
  stats: StudentStats;
  academic_standing: AcademicStanding;
}

export interface StudentClassesStats {
  total_subjects: number;
  total_units: number;
  graded_count: number;
}

export interface StudentClassesResponse {
  student: StudentProfile;
  period: AcademicPeriod;
  available_years: string[];
  classes: StudentClass[];
  enrollment_map: Record<string, StudentEnrollment>;
  stats: StudentClassesStats;
  academic_standing: AcademicStanding;
}

export interface StudentGradeComponent {
  name: string;
  weight: number;
}

export interface StudentGradeTest {
  id: number;
  title: string;
  component_tag: string;
  term_tag: string;
  test_date: string;
}

export interface StudentTestScore {
  grade_id: number;
  raw_score: number;
  max_score: number;
  calculated_percentage: number | null;
  paper_image_id: number | null;
}

export interface StudentSubjectGrade {
  class: StudentClass;
  enrollment: StudentEnrollment;
  final_grade: number | null;

  component_weights: Record<string, number>;
  formula_components: StudentGradeComponent[];

  tests: StudentGradeTest[];
  test_grades: Record<string, StudentTestScore>;
}

export interface StudentGradesResponse {
  student: StudentProfile;
  period: AcademicPeriod;
  available_years: string[];
  classes: StudentSubjectGrade[];
}

export interface StudentGPAValues {
  major_only: number | null;
  simple: number | null;
  weighted: number | null;
}

export interface StudentCurrentPeriod {
  school_year: string;
  semester: string;
}

export interface StudentGPASubject {
  subject_code: string;
  subject_name: string;
  units: number;
  current_grade: number | null;
  is_major_subject: boolean;
}

export interface StudentGPAAssessment {
  id: number;
  test_id: number;
  raw_score: number;
  max_score: number;
  calculated_percentage: number | null;
}

export interface StudentGPACalculatorResponse {
  student: StudentProfile;
  current_period: StudentCurrentPeriod;

  semester_gpa: StudentGPAValues;
  cumulative_gpa: StudentGPAValues;

  enrolled_classes: StudentGPASubject[];
  all_grades: StudentGPAAssessment[];
}

export interface StudentProfileGPA {
  cumulative_weighted: number | null;
}

export interface StudentProfileAcademicStanding {
  standing: string;
  color: string;
}

export interface StudentProfileStats {
  current_enrollments: number;
  total_completed_units: number;
}

export interface StudentProfileResponse {
  student: StudentProfile;
  gpa: StudentProfileGPA;
  academic_standing: StudentProfileAcademicStanding;
  stats: StudentProfileStats;
  student_type: string;
  is_deans_lister: boolean;
  current_period: StudentCurrentPeriod;
}
