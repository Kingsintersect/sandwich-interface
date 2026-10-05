"use client";

import { useAuth } from '@/contexts/AuthContext';
import { WelcomeCard } from './components/WelcomeCard';
import { ApplicationPaymentCard } from './components/ApplicationPaymentCard';
import { ApplicationFormCard } from './components/ApplicationFormCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
// import { DashboardCard } from './components/DashboardCard';
import { AdmissionProgressTrack } from './components/AdmissionProgressTrack';
import { StudentStatusProvider } from '@/contexts/StudentStatusContext';
import { IS_SANDWICH } from '@/config';
import { TuitionPaymentProvider } from '@/contexts/TuitionPaymentContext';
import { CourseList } from './components/CourseCard';
import { useSessionFee } from '@/hooks/useSessionFee';
import { ReturningFeeCard } from './components/ReturningFeeCard';

export default function NewStudentLanding() {
    const { user, access_token, loading, refreshUserData, } = useAuth();
    const ApplicationPaymentStatus = user?.application_payment_status === "FULLY_PAID";

    // Two different flows. A first-year goes through the retry-purchase card;
    // a returning student needs a programme on the request, so they get the
    // programme picker instead. Only ever one of the two.
    const {
        isOwing: owesSessionFee,
        isReturning,
        session: feeSession,
        label: feeLabel,
    } = useSessionFee();
    const showApplicationPayment = owesSessionFee && !isReturning;
    const showReturningFee = owesSessionFee && isReturning;
    let hasApplied = Boolean(user?.is_applied);
    if (IS_SANDWICH) hasApplied = IS_SANDWICH

    return (
        <TuitionPaymentProvider>
            <StudentStatusProvider>
                <div className="min-h-screen bg-background mt-20">
                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {loading
                            ? (
                                <div className='w-full h-screen/2 my-auto flex items-center justify-center'>
                                    <LoadingSpinner size="md" className="mr-2" />
                                    Loading your information...
                                </div>
                            )
                            : <>
                                {/* Welcome Section */}
                                <WelcomeCard user={user} />

                                {/* Current Status */}
                                {showApplicationPayment && <ApplicationPaymentCard access_token={access_token} feeLabel={feeLabel} />}

                                {/* Returning students pay against a programme, so they get
                                    the picker rather than the retry-purchase card. */}
                                {showReturningFee && <ReturningFeeCard session={feeSession} />}

                                {/* Application status */}
                                {(!hasApplied && ApplicationPaymentStatus) && <ApplicationFormCard />}

                                {/* {(hasApplied) && <DashboardCard user={user} />} */}
                                {(hasApplied) && <CourseList student={user} access_token={access_token ?? ""} />}
                                {/* Admission Process Steps */}
                                <AdmissionProgressTrack user={user} reloadUser={refreshUserData} loadingUser={loading} />
                            </>}

                        {/* Important Information */}
                        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Application fee is non-refundable</li>
                                <li>• You have 30 days to complete your application after payment</li>
                                <li>• Ensure all documents are clear and readable before uploading</li>
                                <li>• Check your email regularly for updates on your application status</li>
                            </ul>
                        </div>
                    </main>
                </div>
            </StudentStatusProvider>
        </TuitionPaymentProvider>
    );
}