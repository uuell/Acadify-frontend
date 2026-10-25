export interface TeacherGradingClass {
  id: number;
  subject_name: string;
  subject_code: string;
  units: number;
  section: string | null;
  school_year: string;
  semester: string;
  grading_formula: {
  components: {
    name: string;
    weight: number;
  }[];
} | null;
}

export interface TeacherGradingResponse {
  success: boolean;

  current_academic_period: {
    school_year: string;
    semester: string;
  };

  filters: {
    selected_year: string;
    selected_semester: string;
    available_years: string[];
  };

  classes: TeacherGradingClass[];

  selected_class: TeacherGradingClass | null;

  grading: {
    tests: {
      id: number;
      title: string;
      term_tag: string | null;
      component_tag: string | null;
      max_score: number;
    }[];
    terms: string[];
    components: string[];
    students: {
      student: {
        id: number;
        student_number: string;
        first_name: string;
        last_name: string;
      };
      enrollment: {
        id: number;
        final_grade: number | null;
        final_grade_display: string;
      };
      test_grades: Record<
        string,
        {
          raw_score: number | null;
          max_score: number | null;
        } | null
      >;
      term_grades: Record<
        string,
        {
          grade: number | null;
          display: string;
          missing_components: string[];
        }
      >;
    }[];
  };
}
