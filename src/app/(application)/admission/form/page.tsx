"use client";

import { AdmissionFormData, admissionSchema } from "@/schemas/admission-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { STEPS } from "../../../../components/forms/applicationFormConstants";
import { PersonalInformationStep } from "./components/form-inputs/PersonalInformationStep";
import { AcademicBackgroundStep } from "./components/form-inputs/AcademicBackgroundStep";
import { ProfessionalExperienceStep } from "./components/form-inputs/ProfessionalExperienceStep";
import { ProgramAndEssaysStep } from "./components/form-inputs/ProgramAndEssaysStep";
import { SuccessScreen } from "./components/SuccessScreen";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { NextOfKinInformationStep } from "./components/form-inputs/NextOfKinInformationStep";
import { getFriendlyError, getReactHookFormErrorMessages } from '@/lib/errorsHandler';
import { AcademicCredentialsStep } from "./components/form-inputs/AcademicCredentialsStep";
import { submitAdmissionForm } from "@/app/actions/admission-actions";
import TermsAndConditions from "./components/form-inputs/TermsAndConditionsContent";
import { FormErrorList } from "@/components/forms/FormErrorList";
import { useCurrentSession } from "@/hooks/useAccademics";
import Link from "next/link";

const AdmissionForm: React.FC = () => {
    const { user, access_token, updateUserInState, refreshUserData } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [lauched, setILunched] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        trigger,
        reset,
        setValue,
        getValues,
        watch,
    } = useForm<AdmissionFormData>({
        resolver: zodResolver(admissionSchema),
        mode: 'onChange',
        defaultValues: {
            has_disability: false,
            disability: "None",
            agreeToTerms: false,
            startTerm: "",
            studyMode: 'online',
            awaiting_result: true,
            has_sponsor: false,
            is_next_of_kin_primary_contact: false,
        }
    });
    const allErrors = getReactHookFormErrorMessages(errors);


    const { data: currentSession, isSuccess: isSessionLoaded } = useCurrentSession();
    // const { data: currentSemester, isSuccess: isSemesterLoaded } = useCurrentSemester();

    useEffect(() => {
        if (isSessionLoaded) {
            reset({
                startTerm: currentSession?.name ?? "",
                // academic_semester: currentSemester?.name ?? "",
                // start_year: "2025",
            });
        }
    }, [isSessionLoaded, currentSession, reset]);

    const mutation = useMutation({
        mutationFn: async (data: AdmissionFormData) => {
            if (!access_token || typeof access_token !== 'string') {
                throw new Error("Missing access token");
            }
            return submitAdmissionForm(data, access_token);
        },
        onSuccess: async () => {
            setIsSubmitted(true);
            if (user) {
                updateUserInState({ ...user, is_applied: Number(true) });
            }
            refreshUserData();
            toast.success("Application submitted successfully!");
        },
    });

    const nextStep = async () => {
        const stepConfig = STEPS[currentStep];
        const values = getValues();

        const fieldsToValidate = typeof stepConfig.getFields === 'function'
            ? stepConfig.getFields(values)
            : stepConfig.fields;

        const isStepValid = await trigger(fieldsToValidate);

        if (isStepValid && currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };


    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = (data: AdmissionFormData) => {
        if (typeof access_token === 'string' && access_token.trim() !== '') {
            mutation.mutate(data);
        } else {
            toast.error("Access token is missing or invalid");
        }
    };

    const handleReset = () => {
        // setIsSubmitted(false);
        setCurrentStep(0);
        reset();
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return <PersonalInformationStep control={control} errors={errors} />;
            case 1:
                return <NextOfKinInformationStep control={control} errors={errors} watch={watch} />;
            case 2:
                return <AcademicBackgroundStep control={control} errors={errors} setValue={setValue} />;
            case 3:
                return <AcademicCredentialsStep control={control} errors={errors} setValue={setValue} watch={watch} />;
            case 4:
                return <ProfessionalExperienceStep control={control} errors={errors} />;
            case 5:
                return <ProgramAndEssaysStep control={control} errors={errors} setValue={setValue} watch={watch} setILunched={setILunched} />;
            default:
                return null;
        }
    };

    if (isSubmitted) {
        return <SuccessScreen onReset={handleReset} />;
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <Link href={"/admission"} className="absolute top-10 right-10 z-50 flex items-center gap-3 p-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-bold rounded-lg shadow-md">
                Admission Overview
            </Link>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-(--color-site-b-dark) mb-2">
                        SANDWICH Program Admission
                    </h1>
                    <p className="text-lg text-(--color-site-a-dark)">
                        Take the next step in your career
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="overflow-x-auto">
                        <div className="flex justify-between items-start md:items-center gap-4 mb-4 min-w-[600px] md:min-w-0">
                            {STEPS.map((step, index) => (
                                <div key={index} className="flex flex-col items-center flex-shrink-0 w-20">
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 transition-all duration-300 ${index <= currentStep ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}
                                    >
                                        <span className="font-bold text-sm md:text-base">{index + 1}</span>
                                    </div>
                                    <span
                                        className={`text-[10px] text-center md:text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2" />
                    <FormErrorList allErrors={allErrors} />
                </div>


                {/* Form */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl font-semibold text-gray-900">
                            {STEPS[currentStep].title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Step {currentStep + 1} of {STEPS.length}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {renderCurrentStep()}

                            {/* Error Display */}
                            {mutation.isError && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-700">
                                        {getFriendlyError(mutation.error)}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="flex items-center space-x-2"
                                >
                                    <span>Previous</span>
                                </Button>

                                {currentStep < STEPS.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                                    >
                                        <span>Next</span>
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={!isValid || mutation.isPending}
                                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Submit Application</span>
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500">
                    <p>Need help? Contact our admissions team at support@university.edu</p>
                </div>
            </div>
            <TermsAndConditions lauched={lauched} setILunched={setILunched} />
        </div>
    );
};

export default AdmissionForm;
