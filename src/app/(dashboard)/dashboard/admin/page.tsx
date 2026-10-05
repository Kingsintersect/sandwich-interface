import { GetAmissionApprovedStudentList, GetAmissionRejectedStudentList, GetAppliedStudentList, GetUnappliedStudentList } from '@/app/actions/admin';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Roles } from '@/config';
import { loginSessionKey } from '@/lib/definitions';
import { verifySession } from '@/lib/server.utils';
import { SectionCards } from '@/components/section-cards';
import { AdmissionPipelineChart } from '@/components/admin/AdmissionPipelineChart';
import { ApplicationsTrendChart } from '@/components/admin/ApplicationsTrendChart';
import { buildPipeline, buildTrend, extractRows, extractTotal } from '@/lib/admin.analytics';

const AdminDashboard = async () => {
   const session = await verifySession(loginSessionKey);
   const [approvedAdmission, rejectedAdmission, appliedStudents, unappliedStudents] = await Promise.all([
      GetAmissionApprovedStudentList(session.access_token),
      GetAmissionRejectedStudentList(session.access_token),
      GetAppliedStudentList(session.access_token),
      GetUnappliedStudentList(session.access_token),
   ]);

   // These endpoints don't agree on a shape - some return a bare array, others
   // wrap the rows - so unwrap defensively rather than indexing `.data`.
   const admittedRows = extractRows(approvedAdmission?.success);
   const appliedRows = extractRows(appliedStudents?.success);

   const totalAdmitted = extractTotal(approvedAdmission?.success);
   const totalRejected = extractTotal(rejectedAdmission?.success);
   const totalApplied = extractTotal(appliedStudents?.success);
   const totalUnapplied = extractTotal(unappliedStudents?.success);
   const totalStudents = totalAdmitted + totalRejected + totalApplied + totalUnapplied;

   // Both charts read from the same lists the cards count, so nothing on this
   // page is generated or sampled.
   const pipeline = buildPipeline({
      unapplied: totalUnapplied,
      applied: totalApplied,
      admitted: totalAdmitted,
      rejected: totalRejected,
   });
   const trend = buildTrend(appliedRows, admittedRows);

   return (
      <ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.MANAGER]}>
         <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
            <div className="px-4 lg:px-6">
               <h1 className="text-2xl font-bold tracking-tight text-ocean-900 dark:text-foreground">
                  Overview
               </h1>
               <p className="mt-1.5 text-sm text-muted-foreground">
                  Admissions activity across the Sandwich Programme.
               </p>
            </div>

            <SectionCards
               studentStat={{
                  totalStudents,
                  totalAdmitted,
                  totalApplied,
                  totalRejected,
                  totalUnapplied,
               }}
            />

            <div className="grid grid-cols-1 gap-5 px-4 lg:grid-cols-5 lg:px-6">
               <div className="lg:col-span-2">
                  <AdmissionPipelineChart data={pipeline} />
               </div>
               <div className="lg:col-span-3">
                  <ApplicationsTrendChart data={trend} />
               </div>
            </div>
         </div>
      </ProtectedRoute>
   )
}

export default AdminDashboard
