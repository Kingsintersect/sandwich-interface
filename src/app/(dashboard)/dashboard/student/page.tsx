"use client";

import dynamic from 'next/dynamic';
import { useMemo } from "react";
import { Award01Icon, Book02Icon } from "@hugeicons/core-free-icons";
import StudentBanner from "./componenets/StudentBanner";
import SessionEnrolment from "./componenets/SessionEnrolment";
import SessionFeeNotice from "./componenets/SessionFeeNotice";
import { AdmissionStatus, StatusCheckCard } from "./componenets/Status";
import { useAuth } from "@/contexts/AuthContext";
import { Roles } from "@/config";
import { CourseProgress } from "../components/course-progress";
import { RecentAssessments } from "../components/recent-assessments";
import { StatCard } from "../components/StatCard";
import { Icon } from "@/components/ui/icon";
import {
   collectAssessments,
   summariseAcademics,
   useStudentGradeReport,
} from "@/hooks/useStudentAcademics";
import { useCurrentSession } from "@/hooks/useAccademics";
import { resolveStudentLevel } from "@/lib/academics.utils";
import { useSessionFee } from "@/hooks/useSessionFee";

const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), { ssr: false });

const StudentHome = () => {
   const { user } = useAuth();
   const student = user;

   const { data: report, isLoading, isError } = useStudentGradeReport();
   const { data: session } = useCurrentSession();
   const studentSession = (student?.academic_session as string) || session?.name;
   const level = resolveStudentLevel(student);
   const sessionFee = useSessionFee();

   const courses = useMemo(() => report?.courses ?? [], [report]);

   const stats = useMemo(() => summariseAcademics(courses), [courses]);
   const assessments = useMemo(() => collectAssessments(courses), [courses]);

   const progressCourses = useMemo(
      () =>
         courses.map((course) => {
            const score = Number(course.finalgrade);
            return {
               id: course.course_id,
               name: course.course_name,
               code: course.course_code,
               score: Number.isFinite(score) && score > 0 ? score : null,
               grade: course.grade,
               creditLoad: course.credit_load,
            };
         }),
      [courses]
   );

   return (
      <ProtectedRoute allowedRoles={[Roles.STUDENT]}>
         {student && (
            <div className="space-y-8 pb-10">
               {/* Welcome Banner */}
               <StudentBanner student={student} />

               {/* The student's own session, not the programme-wide active one:
                   those diverge until the student enrols into the new session. */}
               {studentSession && (
                  <p className="text-sm text-muted-foreground">
                     Your session:{" "}
                     <span className="font-semibold text-ocean-800 dark:text-foreground">
                        {studentSession}
                     </span>
                     {level && (
                        <>
                           {" · "}
                           <span className="font-semibold text-ocean-800 dark:text-foreground">
                              {level}
                           </span>
                        </>
                     )}
                  </p>
               )}

               <SessionFeeNotice />

               {/* One fee applies per student: a first-session student pays the
                   application fee, a returning one pays the session fee. */}
               <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <StatusCheckCard
                     admission={student.admission_status}
                     url={sessionFee.payUrl}
                     dataStatus={sessionFee.status}
                     title={sessionFee.label}
                  />

                  <AdmissionStatus admissionStatus={student.admission_status} />

                  <StatCard
                     title="Current GPA"
                     value={isLoading ? "—" : String(stats.gpa)}
                     icon={<Icon icon={Award01Icon} className="size-6" />}
                  />
                  <StatCard
                     title="Registered courses"
                     value={isLoading ? "—" : String(stats.courseCount)}
                     icon={<Icon icon={Book02Icon} className="size-6" />}
                  />
               </div>

               <SessionEnrolment />

               {/* Content Grid */}
               <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                  <CourseProgress
                     courses={progressCourses}
                     isLoading={isLoading}
                     isError={isError}
                  />
                  <RecentAssessments
                     assessments={assessments}
                     isLoading={isLoading}
                     isError={isError}
                  />
               </div>
            </div>
         )}
      </ProtectedRoute>
   );
}

export default StudentHome
