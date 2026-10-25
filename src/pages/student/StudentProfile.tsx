import { useEffect, useState } from "react";
import api from "../../api/axios";

import StudentProfileHeader from "../../components/student/StudentProfileHeader";
import StudentProfileStats from "../../components/student/StudentProfileStats";
import StudentProfileInfo from "../../components/student/StudentProfileInfo";

import type { StudentProfileResponse } from "../../types/student";
import "./StudentProfile.css";

function StudentProfile() {
    const [profileData, setProfileData] =
        useState<StudentProfileResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function fetchProfile() {
            try {
                const response = await api.get<StudentProfileResponse>(
                    "/student/profile"
                );

                if (active) {
                    setProfileData(response.data);
                    setError(null);
                }
            } catch (err) {
                if (active) {
                    console.error("Failed to fetch student profile:", err);
                    setError("Failed to load student profile.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchProfile();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return <p>Loading student profile...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }

    if (!profileData) {
        return <p>Student profile not found.</p>;
    }

    const { student, academic_standing, gpa, stats } = profileData;

    return (
        <div className="student-profile-page">
            <header className="student-page-header">
                <h1>My Profile</h1>
                <p>View your personal and academic information.</p>
            </header>

            <StudentProfileHeader
                student={student}
                academicStanding={academic_standing}
                studentType={profileData.student_type}
                isDeansLister={profileData.is_deans_lister}
            />

            <StudentProfileStats
                gpa={gpa}
                stats={stats}
            />

            <StudentProfileInfo
                student={student}
                studentType={profileData.student_type}
                currentPeriod={profileData.current_period}
            />
        </div>
    );
}

export default StudentProfile;