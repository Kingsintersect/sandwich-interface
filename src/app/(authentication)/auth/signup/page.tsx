"use client";
import Stepper from "@/components/Stepper";
import { FormFieldSet, InputFormField, SelectFormField } from '@/components/ui/inputs/FormFields';
import { AlertCircleIcon, Loader2, SaveAll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import useSignInMultiStepViewModel, { SignupFormData } from "@/hooks/use-signUp-multistep-view-model";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { formatToCurrency } from "@/lib/utils";
import { useExternalPrograms } from "@/hooks/useExternalPrograms";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProgramAccordionDisplay } from "@/components/ProgramAccordion";
import { FormErrorList } from "@/components/forms/FormErrorList";


// type SignupFormData = z.infer<typeof SignupSchema>;
export default function SignupPage() {
    const {
        currentStep,
        nextStep,
        prevStep,
        NewGender,
        NewNationality,
        NewState,
        register,
        handleSubmit,
        onSubmit,
        control,
        errors,
        allErrors,
        isSubmitting,
        steps,
        // parentPrograms,
        // childPrograms,
        // selectedProgramId,
        // isProgramsLoading,
        // handleProgramChange,
        delta,
        watch,
        setValue,
        getValues,
        // APPLICATION_FEE,
    } = useSignInMultiStepViewModel();
    const isLastStep = currentStep === steps.length;
    const { data: programs, isLoading, isError } = useExternalPrograms();

    return (
        <div className="block w-full space-y-1 text-left">
            <Stepper steps={steps} currentStep={currentStep} />
            <FormErrorList allErrors={allErrors} />
            <form
                onSubmit={isLastStep ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && currentStep !== steps.length) {
                        e.preventDefault();
                    }
                }}
                className={`block max-h-[450px] overflow-y-scroll overflow-x-hidden pr-5`}>
                {currentStep == 1 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <FormFieldSet classList={`bg-white border-0 py-2`} >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 my-4 gap-y-4">
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'first_name'}
                                    label={"Your First Name"}
                                    name="first_name"
                                    register={register}
                                    error={errors.first_name}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'last_name'}
                                    label="Your Last Name"
                                    name="last_name"
                                    register={register}
                                    error={errors.last_name}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'other_name'}
                                    label="Other Names"
                                    name="other_name"
                                    register={register}
                                    error={errors.other_name}
                                />
                                <InputFormField<SignupFormData>
                                    classList=""
                                    type="text"
                                    id={'phone_number'}
                                    label="Phone Number"
                                    name="phone_number"
                                    register={register}
                                    error={errors.phone_number}
                                />
                                <SelectFormField<SignupFormData>
                                    name="gender"
                                    label={"Your Gender"}
                                    control={control}
                                    error={errors.gender}
                                    options={NewGender}
                                />
                                <SelectFormField<SignupFormData>
                                    name="nationality"
                                    label={"Country of origin"}
                                    control={control}
                                    error={errors.nationality}
                                    options={NewNationality.map(item => ({ value: String(item.value), label: String(item.value) }))}
                                />
                                <SelectFormField<SignupFormData>
                                    name="state"
                                    label={"State of origin"}
                                    control={control}
                                    error={errors.state}
                                    options={NewState.map(item => ({ value: String(item.value), label: String(item.value) }))}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'hometown_address'}
                                    label="Home Town Address"
                                    name="hometown_address"
                                    register={register}
                                    error={errors.hometown_address}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'residential_address'}
                                    label="Residential Address"
                                    name="residential_address"
                                    register={register}
                                    error={errors.residential_address}
                                />
                            </div>
                        </FormFieldSet>
                    </motion.div>
                )}
                {currentStep == 2 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {(isLoading) && (
                            <div className='w-full flex items-center justify-center'>
                                <LoadingSpinner size="md" className="mr-2" />
                                Loading Programs...
                            </div>
                        )}
                        {(isError || !programs) && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>Failed to load programs.</AlertTitle>
                                <AlertDescription>
                                    <p>Please check your network connection and try again.</p>
                                </AlertDescription>
                            </Alert>
                        )}
                        <ProgramAccordionDisplay<SignupFormData>
                            programs={programs}
                            setValue={setValue}
                            getValues={getValues}
                            errors={errors}
                            watch={watch}
                            fieldKey="program"
                            fieldIdKey="program_id"
                            subHeading="any program can be selected from the parent to the child program..."
                        />
                    </motion.div>
                )}
                {currentStep == 3 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <FormFieldSet classList={`bg-white border-0`} >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">

                                <InputFormField<SignupFormData>
                                    classList={"md:col-span-2"}
                                    type="text"
                                    id={'email'}
                                    label="Email address"
                                    name="email"
                                    register={register}
                                    error={errors.email}
                                />
                                <InputFormField<SignupFormData>
                                    classList={"col-span-full"}
                                    type="text"
                                    id={'username'}
                                    label="Username"
                                    name="username"
                                    register={register}
                                    error={errors.username}
                                />
                                <InputFormField<SignupFormData>
                                    type="password"
                                    id={'password'}
                                    label="Your password"
                                    name="password"
                                    register={register}
                                    error={errors.password}
                                />
                                <InputFormField<SignupFormData>
                                    type="password"
                                    id={'password_confirmation'}
                                    label="Confirm your password"
                                    name="password_confirmation"
                                    register={register}
                                    error={errors.password_confirmation}
                                />
                            </div>
                        </FormFieldSet>
                    </motion.div>
                )}
                {/* {currentStep == 4 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <FormFieldSet classList={`bg-white border-0`} >
                            <div className="flex items-center justify-center">
                                <Card className="w-full max-w-md">
                                    <CardHeader className="text-center">
                                        <CheckCircle2 className="mx-auto h-12 w-12 text-site-a-dark" />
                                        <CardTitle className="text-2xl font-bold text-gray-500">You will be charged the Sum of <br /><strong className="text-orange-500 text-3xl animate-pulse">{formatToCurrency(APPLICATION_FEE)}</strong> <br /> to Purchase the Admission Form.</CardTitle>
                                        <CardDescription>

                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <InputFormField<SignupFormData>
                                            type="hidden"
                                            id={'amount'}
                                            label="Confirm your password"
                                            name="amount"
                                            register={register}
                                            error={errors.amount}
                                            value={APPLICATION_FEE}
                                            valueAsNumber={true}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </FormFieldSet>
                    </motion.div>
                )} */}

                <div className="mt-6 flex justify-between">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-4 py-1 bg-gray-300 rounded-md ${currentStep === 1 ? "hidden" : "block"}`}
                    >
                        ← Previous
                    </button>
                    <Button
                        type={isLastStep ? "submit" : "button"}
                        onClick={async (e) => {
                            if (!isLastStep) {
                                e.preventDefault();
                                await nextStep();
                            }
                        }}
                        className={`px-4 py-1 bg-site-b hover:bg-site-b-light text-white rounded-md ml-auto cursor-pointer ${isLastStep ? "w-[50%] text-lg font-bold" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isLastStep ? (
                            <>
                                {isSubmitting ? (
                                    <>
                                        <span>{"Processing"}</span>
                                        <Loader2 fontSize={20} size={20} className="animate-spin text-lg" />
                                    </>
                                ) : (
                                    <span className="flex items-center gap-3">{"Submit"} <SaveAll size={36} strokeWidth={2.75} /></span>
                                )}
                            </>
                        ) : (
                            "Continue →"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
