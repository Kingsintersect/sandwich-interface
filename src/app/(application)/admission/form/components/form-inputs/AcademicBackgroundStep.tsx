import { Control, FieldErrors, UseFormReturn } from "react-hook-form";
import { AdmissionFormData } from "@/schemas/admission-schema";
import { FormField } from "@/components/forms/FormField";

export const AcademicBackgroundStep: React.FC<{ control: Control<AdmissionFormData>; errors: FieldErrors<AdmissionFormData>; setValue: UseFormReturn<AdmissionFormData>['setValue'] }> = ({ control, errors }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                name="undergraduateDegree"
                control={control}
                errors={errors}
                label="Undergraduate Degree"
                required
                placeholder="Bachelor of Science in Economics"
            />
            <FormField
                name="university"
                control={control}
                errors={errors}
                label="University"
                required
                placeholder="Nnamdi Azikiwe University"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                name="graduationYear"
                control={control}
                errors={errors}
                label="Graduation Year"
                required
                placeholder="2022"
            />
            <FormField
                name="gpa"
                control={control}
                errors={errors}
                label="GPA"
                placeholder="3.8"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                name="gmatScore"
                control={control}
                errors={errors}
                label="GMAT Score (Optional)"
                placeholder="720"
            />
            <FormField
                name="greScore"
                control={control}
                errors={errors}
                label="GRE Score (Optional)"
                placeholder="320"
            />
            <FormField
                name="toeflScore"
                control={control}
                errors={errors}
                label="TOEFL Score (Optional)"
                placeholder="110"
            />
        </div>
    </div>
);