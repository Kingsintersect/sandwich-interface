
import { StudentHeader } from './components/StudentHeader';
import { StudentInfo } from './components/StudentInfo';
import { CourseTable } from './components/CourseTable';
import { GradeDistribution } from './components/GradeDistribution';
import { AcademicStanding } from './components/AcademicStanding';
import { ReportFooter } from './components/ReportFooter';
import { verifySession } from '@/lib/server.utils';
import { loginSessionKey } from '@/lib/definitions';
import { getStudentGradeReport } from './api/studentGradeReport.api';
import { generateGPASummary, processGradeReport } from '@/lib/gpa.utils';

const StudentGradeReport = async () => {
    const session = await verifySession(loginSessionKey);
    const gradeReport = await getStudentGradeReport(
        session.user.email,
        session.access_token,
        session.user?.academic_session
    );
    const processedGradeReport = processGradeReport(gradeReport);

    const summary = generateGPASummary(processedGradeReport.courses);
    const { gpa, totalCredits, totalQualityPoints, degreeClass, academicStanding } = summary;

    return (
        <div className="pb-10">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                <StudentHeader
                    gradeReport={processedGradeReport}
                    gpa={gpa}
                    totalCredits={totalCredits}
                    totalQualityPoints={totalQualityPoints}
                    degreeClass={degreeClass}
                />
                <StudentInfo />
                <CourseTable courses={processedGradeReport.courses} />

                <div className="border-t border-border bg-muted/30 px-7 py-6">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
                        Performance summary
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <GradeDistribution courses={processedGradeReport.courses} />
                        <AcademicStanding
                            gpa={gpa}
                            degreeClass={degreeClass}
                            academicStanding={academicStanding}
                        />
                    </div>
                </div>

                <ReportFooter academicYear={processedGradeReport.academicYear} />
            </div>
        </div>
    );
};

export default StudentGradeReport;
