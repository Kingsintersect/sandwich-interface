import { Control, FieldErrors } from "react-hook-form";
import { FormField } from "../../../../../../components/forms/FormField";
import { AdmissionFormData } from "@/schemas/admission-schema";
import { YEARS_OF_EXPERIENCE } from "../../../../../../components/forms/applicationFormConstants";

export const ProfessionalExperienceStep: React.FC<{ control: Control<AdmissionFormData>; errors: FieldErrors<AdmissionFormData> }> = ({ control, errors }) => (
    <div className="space-y-6">
        <FormField
            name="workExperience"
            control={control}
            errors={errors}
            label="Work Experience"
            type="textarea"
            placeholder="Describe your work experience..."
            rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                name="currentPosition"
                control={control}
                errors={errors}
                label="Current Position"
                placeholder="Senior Marketing Manager"
            />
            <FormField
                name="company"
                control={control}
                errors={errors}
                label="Company"
                placeholder="Microsoft Corporation"
            />
        </div>

        <FormField
            name="yearsOfExperience"
            control={control}
            errors={errors}
            label="Years of Experience"
            type="select"
            placeholder="Select years of experience"
            options={YEARS_OF_EXPERIENCE}
        />
    </div>
);