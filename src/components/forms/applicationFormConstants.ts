import { AdmissionFormData } from "@/schemas/admission-schema";
import { Briefcase, FileText, GraduationCap, FileStack, Users, User } from "lucide-react";
import { Control, FieldErrors, Path } from "react-hook-form";

export interface Step {
    title: string;
    icon: React.ElementType;
    // fields: (keyof AdmissionFormData)[];
    fields?: Path<AdmissionFormData>[];
    getFields?: (values: AdmissionFormData) => Path<AdmissionFormData>[];
}

export interface FormFieldProps {
    name: keyof AdmissionFormData;
    control: Control<AdmissionFormData>;
    errors: FieldErrors<AdmissionFormData>;
    label: string;
    required?: boolean;
    type?: 'text' | 'email' | 'date' | 'textarea' | 'select' | 'radio' | 'checkbox';
    placeholder?: string;
    options?: { value: string; label: string, disabled?: boolean }[];
    rows?: number;
}
export const STEPS: Step[] = [
    {
        title: 'Personal Information',
        icon: User,
        fields: ['lga', 'religion', 'dob', 'gender', 'hometown', 'hometown_address', 'contact_address']
    },
    {
        title: 'Next of Kin',
        icon: Users,
        getFields: (values) => {
            const baseFields: Path<AdmissionFormData>[] = [
                'has_sponsor',
                'next_of_kin_name',
                'next_of_kin_relationship',
                'next_of_kin_phone_number',
                'next_of_kin_address',
                'is_next_of_kin_primary_contact',
                'next_of_kin_occupation',
                'next_of_kin_workplace',
            ];

            const sponsorFields: Path<AdmissionFormData>[] = [
                'sponsor_name',
                'sponsor_relationship',
                'sponsor_email',
                'sponsor_contact_address',
                'sponsor_phone_number',
            ];

            return values.has_sponsor ? [...baseFields, ...sponsorFields] : baseFields;
        }
    },
    {
        title: 'Academic Background',
        icon: GraduationCap,
        fields: ['undergraduateDegree', 'university', 'graduationYear']
    },
    {
        title: 'Academic Credentials',
        icon: FileStack,
        fields: ['first_school_leaving', 'o_level', 'hnd', 'degree', "degree_transcript", 'other_documents']
    },
    {
        title: 'Professional Experience (Optional)',
        icon: Briefcase,
        fields: ['workExperience', 'currentPosition', 'company', 'yearsOfExperience']
    },
    {
        title: 'Program & Essays',
        icon: FileText,
        fields: ['startTerm', 'studyMode', 'personalStatement', 'careerGoals', 'agreeToTerms']
    },
];

export const GENDER = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
];

export const RELIGION = [
    { value: 'christianity', label: 'Christianity' },
    { value: 'islamic', label: 'Islamic' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'other', label: 'Other' },
]

export const ACADEMIC_SESSION = [
    { value: '2025/2026', label: '2025 / 2026' },
    { value: '2024/2025', label: '2024 / 2025' },
];

export const YEARS_OF_EXPERIENCE = [
    { value: '0-1', label: '0-1 years' },
    { value: '2-3', label: '2-3 years' },
    { value: '4-5', label: '4-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '10+', label: '10+ years' },
];

export const STUDY_MODES = [
    { value: 'part-time', label: 'Part Time (Hybrid)' },
    { value: 'online', label: 'Online (Premium)' },
];

export const COUNTRIES = [
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Others', label: 'Others' },
]