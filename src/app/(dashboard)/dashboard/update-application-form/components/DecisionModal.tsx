"use client";

// import { ACADEMIC_SESSION } from '@/components/forms/applicationFormConstants';
// import { EditableSelect } from '@/components/forms/EditableFormFields';
import { Textarea } from '@/components/ui/textarea';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { ApplicationApproveValues, ApplicationRejectValues, applicationReview } from '@/schemas/applicationReview-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface DecisionModalProps {
    decisionType: 'admitted' | 'not_admitted' | "";
    application: ApplicationDetailsType | null | undefined;
    onClose: () => void;
    onSubmit: (values?: ApplicationRejectValues | ApplicationApproveValues | undefined) => Promise<void>;
    isLoading: boolean;
}

export const DecisionModal = ({
    decisionType,
    application,
    onClose,
    onSubmit,
    isLoading,
}: DecisionModalProps) => {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<ApplicationRejectValues>({
        resolver: zodResolver(applicationReview),
        defaultValues: {
            application_id: String(application?.id),
            reason: '',
        },
    });

    const application_id = String(application?.id);
    const program = application?.program as string;
    const program_id = String(application?.program_id);
    const study_mode = application?.application.studyMode as string;
    const academic_session = application?.academic_session as string;
    const semester = application?.academic_semester as string;

    // Handle form submission differently based on decision type
    const handleFormSubmit = async (formData: ApplicationRejectValues) => {
        if (decisionType === 'admitted') {
            // For approval, we don't need form data
            await onSubmit({ application_id, program, program_id, study_mode, academic_session, semester });
        } else {
            // For rejection, pass the form data
            await onSubmit({
                application_id,
                reason: formData.reason
            });
        }
    };

    // Handle direct approval (bypass form validation)
    const handleDirectApproval = async () => {
        await onSubmit({ application_id, program, program_id, study_mode, academic_session, semester });
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-xl w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {decisionType === 'admitted' ? 'Approve Application' : 'Reject Application'}
                </h3>

                {decisionType !== 'admitted' ? (
                    // Rejection form with validation
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Rejection
                                </label>
                                <input type="hidden" {...register('application_id')} />
                                <Textarea
                                    {...register('reason')}
                                    rows={8}
                                    placeholder="Please provide a reason for rejection..."
                                    className='rounded-xl'
                                />
                                {errors.reason && (
                                    <p className="text-sm text-red-500">{errors.reason.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                disabled={isSubmitting || isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {(isSubmitting || isLoading) ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Reject Application'
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    // Approval confirmation (no form needed)
                    <div className="space-y-4">
                        <div className="w-full space-y-5 my-10 text-left">
                            <div className="flex flex-row gap-5">
                                <div className="w-32 font-bold text-lg text-orange-950">PROGRAM: </div>
                                <div className="grow text-gray-700">{program}</div>
                            </div>
                            <div className="flex flex-row gap-5">
                                <div className="w-32 font-bold text-lg text-orange-950">STUDY MODE: </div>
                                <div className="grow text-gray-700">{study_mode}</div>
                            </div>
                            <div className="flex flex-row gap-5">
                                <div className="w-32 font-bold text-lg text-orange-950">BEGINS: </div>
                                <div className="grow text-gray-700">
                                    {academic_session}
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 text-sm text-center">
                                Are you sure you want to approve this application? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                disabled={isSubmitting || isLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDirectApproval}
                                disabled={isSubmitting || isLoading}
                                className="px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {(isSubmitting || isLoading) ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Approve Application'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


/**
 * BELOW CODE USES MUTATION
 * AM GOIN TO ADPT IT FOR THE ABOVE CODE BY MORNING
 */




// "use client";

// import { ApproveStudentApplicantion, RejectStudentApplicantion } from '@/app/actions/applications';
// import { Textarea } from '@/components/ui/textarea';
// import { toastApiError, toastSuccess } from '@/lib/toastApiError';
// import { ApplicationDetailsType } from '@/schemas/admission-schema';
// import { applicationReview, ApplicationReviewFormValues } from '@/schemas/applicationReview-schema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { Loader2 } from 'lucide-react';
// import React from 'react'
// import { useForm } from 'react-hook-form';

// interface DecisionModalProps {
//     decisionType: string;
//     setShowDecisionModal: (boolean) => void;
//     submitDecision: () => void
//     application: ApplicationDetailsType | null | undefined;
// }
// export const DecisionModal = ({ decisionType, setShowDecisionModal, submitDecision, application }: DecisionModalProps) => {
//     const queryClient = useQueryClient();
//     const program = application?.program as string;
//     const study_mode = application?.application.studyMode as string;
//     const academic_session = application?.application.academic_session as string;

//     const {
//         handleSubmit,
//         register,
//         formState: { errors },
//     } = useForm<ApplicationReviewFormValues>({
//         resolver: zodResolver(applicationReview),
//         defaultValues: {
//             reason: '',
//         },
//     });

//     const approveAdmissionMutation = useMutation({
//         mutationFn: ApproveStudentApplicantion,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['approveAdmissionMutation'] });
//             toastSuccess(`Admission approved successfully!`);
//             submitDecision();
//             // router.push("/admin/products");
//         },
//         onError: (error) => {
//             console.error(error);
//             toastApiError(error, "Failed to approve admission");
//         },
//     });
//     const rejectAdmissionMutation = useMutation({
//         mutationFn: RejectStudentApplicantion,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['rejectAdmissionMutation'] });
//             toastSuccess(`Rejection note sent successfully!`);
//             submitDecision();
//             // router.push("/admin/products");
//         },
//         onError: (error) => {
//             console.error(error);
//             toastApiError(error, "Failed to send rejection note");
//         },
//     });

//     const handleApproval = () => {
//         if (application) {
//             approveAdmissionMutation.mutate({
//                 application_id: application.id,
//                 program: application.program,
//                 program_id: String(application.program_id),
//                 academic_semester: "1SM",//application.accademic_semester,
//                 accademic_session: application.accademic_session
//             });
//         }
//     };
//     const handleRejection = (values: ApplicationReviewFormValues) => {
//         if (!application?.id) return;
//         rejectAdmissionMutation.mutate({ ...values, application_id: application.id });
//     };

//     return (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-xl w-full p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     {decisionType === 'admitted' ? 'Approve Application' : 'Reject Application'}
//                 </h3>
//                 <form onSubmit={handleSubmit(handleRejection)} className="">
//                     {decisionType !== 'admitted'
//                         ?
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Notes
//                                 </label>
//                                 <label className="block text-sm font-medium mb-2">Description</label>
//                                 <Textarea
//                                     {...register('reason')}
//                                     rows={8}
//                                     placeholder="Add notes about your decision..."
//                                     className='rounded-xl'
//                                 />
//                                 {errors.reason && (
//                                     <p className="text-sm text-red-500">{errors.reason.message}</p>
//                                 )}
//                             </div>
//                         </div>
//                         :
//                         <div className="space-y-4">
//                             <div className="w-full space-y-5 my-10 text-left">
//                                 <div className="flex flex-row gap-5">
//                                     <div className="w-32 font-bold text-lg text-orange-950">PROGRAM: </div>
//                                     <div className="grow text-gray-700">{program}</div>
//                                 </div>
//                                 <div className="flex flex-row gap-5">
//                                     <div className="w-32 font-bold text-lg text-orange-950">STUDY MODE: </div>
//                                     <div className="grow text-gray-700">{study_mode}</div>
//                                 </div>
//                                 <div className="flex flex-row gap-5">
//                                     <div className="w-32 font-bold text-lg text-orange-950">BEGINS: </div>
//                                     <div className="grow text-gray-700">{academic_session}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     }
//                     <div className="flex justify-end space-x-3 mt-6">
//                         <button
//                             onClick={() => setShowDecisionModal(false)}
//                             className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                         >
//                             Cancel
//                         </button>
//                         {decisionType === 'admitted'
//                             ? <button
//                                 onClick={handleApproval}
//                                 className={`px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700`}
//                             >
//                                 {approveAdmissionMutation.isPending ? (
//                                     <div className='flex items-center justify-center gap-2'>
//                                         <Loader2 className="w-5 h-5 animate-spin" />
//                                         <span>Sending request...</span>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         {'Approve'}
//                                     </>
//                                 )}
//                             </button>
//                             : <button
//                                 type='submit'
//                                 // onClick={submitDecision}
//                                 className={`px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700`}
//                             >
//                                 {rejectAdmissionMutation.isPending ? (
//                                     <div className='flex items-center justify-center gap-2'>
//                                         <Loader2 className="w-5 h-5 animate-spin" />
//                                         <span>Sending request...</span>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         {'Reject'}
//                                     </>
//                                 )}
//                             </button>
//                         }
//                     </div>
//                 </form>
//             </div>
//         </div >
//     )
// }
