import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { AlertCircle, AlertCircleIcon, Check, Clock, Eye, X, Loader } from 'lucide-react'
import Image from 'next/image';
import React from 'react'
import PersonalInfo from './editables/PersonalInfo';
import AcademicInformation from './editables/AcademicInformation';
import NextOfkinInfo from './editables/NextOfkinInfo';
import SponsorsInfo from './editables/SponsorsInfo';
import WorkExperienceInfo from './editables/WorkExperienceInfo';
import ProgramInfo from './editables/ProgramInfo';
import PersonalStatementInfo from './editables/PersonalStatementInfo';
import CareerGoalsInfo from './editables/CareerGoalsInfo';
import QualificationDocuments from './editables/QualificationDocuments';
import { FormatImageUrl } from '@/lib/imageUrl';
import { ImagePreviewModal } from '@/components/application/ImagePreviewModal';

export const ApplicationDetails = ({
    isLoading,
    error,
    application
}: {
    isLoading: boolean;
    error: string | null;
    application: ApplicationDetailsType;
}) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'ADMITTED': return <Check className="w-4 h-4" />;
            case 'INPROGRESS': return <Loader className="w-4 h-4" />;
            case 'NOT_ADMITTED': return <X className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ADMITTED': return 'text-green-600 bg-green-50';
            case 'INPROGRESS': return 'text-cyan-600 bg-cyan-50';
            case 'NOT_ADMITTED': return 'text-red-600 bg-red-50';
            default: return 'text-yellow-600 bg-yellow-50';
        }
    };
    return (
        <div className="lg:col-span-2">
            {isLoading ? (
                <div className='w-full flex items-center justify-center'>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Loading Application Review Data...
                </div>
            ) : application ? (
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <div className="">
                                <div className="mb-5">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {(application.first_name + " " + application.last_name).toUpperCase()}
                                    </h2>
                                    <hr className='mt-1 mb-2' />
                                    <p className="text-gray-600">{application.program} Application</p>
                                </div>
                                <div className="">
                                    <div className="relative w-52 h-auto aspect-square cursor-pointer">
                                        <Image
                                            src={FormatImageUrl(application?.application.passport as unknown as string) ?? "/avatars/avatar-man.jpg"}
                                            fill
                                            className="object-cover rounded-lg"
                                            alt='Passport'
                                            onClick={() => setIsModalOpen(true)}
                                        />
                                    </div>
                                    <ImagePreviewModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        imageUrl={FormatImageUrl(application?.application.passport as unknown as string) || ''}
                                        imageName={String(application.first_name)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(application.admission_status)}`}>
                                    {getStatusIcon(application.admission_status)}
                                    <span className="capitalize">{application.admission_status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Personal Information */}
                        <PersonalInfo
                            application={{
                                email: String(application.email),
                                phone_number: String(application.phone_number),
                                nationality: String(application.nationality),
                                userId: String(application.id),

                                id: String(application?.application.id),
                                lga: String(application?.application.lga),
                                dob: String(application?.application.dob),
                                gender: String(application?.application.gender),
                                hometown: String(application?.application.hometown),
                                hometown_address: String(application?.application.hometown_address),
                                contact_address: String(application?.application.contact_address),
                                religion: String(application?.application.religion),
                            }}
                        />

                        {/* Program Information */}
                        <ProgramInfo
                            application={{
                                program: String(application.program),
                                program_id: String(application.program_id),
                                studyMode: String(application?.application.studyMode),
                                startTerm: String(application?.application.startTerm),
                                academic_session: String(application?.academic_session),

                                id: String(application?.application.id),
                            }}
                        />

                        {/* Essay */}
                        <PersonalStatementInfo
                            application={application?.application}
                        />
                        {/* Career Golas */}
                        <CareerGoalsInfo
                            application={application?.application}
                        />
                        {/* CERTIFICATE IMAGES */}
                        <div className="col-span-full">
                            <QualificationDocuments
                                application={application?.application}
                            />
                        </div>

                        {/* Academic Information */}
                        <AcademicInformation
                            application={application?.application}
                        />

                        {/* Work Experience */}
                        <WorkExperienceInfo
                            application={application?.application}
                        />

                        {/* Next of kin Information */}
                        <NextOfkinInfo
                            application={application?.application}
                        />

                        {/* Sponsors Information */}

                        <SponsorsInfo
                            application={application?.application}
                        />
                        {/* Application Notes */}
                        {application.reason_for_denial && <div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Review Notes
                                </h3>
                                <p className="text-sm text-red-700 bg-blue-50 p-4 rounded-lg border-l-4 border-red-500">{application.reason_for_denial}</p>
                            </div>
                        </div>}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
                    <p className="text-gray-600">Choose an application from the list to view details and make admission decisions.</p>
                </div>
            )}
            {error &&
                <>
                    <hr />
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Unable to fetch application application?.application?.</AlertTitle>
                        <AlertDescription>
                            <p>Please verify netwoork and try again.</p>
                        </AlertDescription>
                    </Alert>
                </>
            }
        </div>
    )
}
