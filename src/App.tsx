import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Privacy from "./pages/public/Privacy";

import StudentLogin from "./pages/auth/StudentLogin";
import TeacherLogin from "./pages/auth/TeacherLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentClasses from "./pages/student/StudentClasses";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentGrades from "./pages/student/StudentGrades";
import StudentGPACalculator from "./pages/student/StudentGPACalculator";
import StudentProfile from "./pages/student/StudentProfile";

import TeacherLayout from "./layouts/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherClassDetails from "./pages/teacher/TeacherClassDetails";
import TeacherGrading from "./pages/teacher/TeacherGrading";
import TeacherAIGrading from "./pages/teacher/TeacherAIGrading";
import TeacherProfile from "./pages/teacher/TeacherProfile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import ProgressionChecker from "./pages/admin/ProgressionChecker";
import SystemSettings from "./pages/admin/SystemSettings";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="gpa-calculator" element={<StudentGPACalculator />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>


      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="classes/:classId" element={<TeacherClassDetails />} />
        <Route path="grading" element={<TeacherGrading />} />
        <Route path="ai-grading" element={<TeacherAIGrading />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="progression" element={<ProgressionChecker />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

    </Routes>
  );
}

export default App;