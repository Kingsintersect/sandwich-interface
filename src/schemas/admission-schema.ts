import { UserInterface } from "@/config/Types";
import { baseSignupSchema } from "@/hooks/use-signUp-multistep-view-model";
import z from "zod";


// Max file size (e.g., 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    // Documents
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

// Zod validation schema
// export const admissionSchema = z.object({
export const baseAdmissionSchema = z.object({
    id: z.string().optional(),

    // Personal Information
    lga: z.string().min(1, 'Local Gov. Area is required'),
    religion: z.string().min(2, 'Religion is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    gender: z.string().min(1, 'Gender is required'),
    hometown: z.string().min(2, 'Home town is required'),
    hometown_address: z.string().min(2, 'Home town address is required'),
    contact_address: z.string().min(2, 'Contact address is required'),

    // Sponsors Information
    has_sponsor: z.boolean().default(false),//to be changed to has_sponsor
    sponsor_name: z.string().optional(),
    sponsor_relationship: z.string().optional(),
    sponsor_email: z.string().email('Invalid email address').optional(),
    sponsor_contact_address: z.string().optional(),
    sponsor_phone_number: z.string().optional(),

    // next of kin
    next_of_kin_name: z.string().min(1, "Full name is required"),
    next_of_kin_relationship: z.string().min(1, "Relationship is required"),
    next_of_kin_phone_number: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number is too long"),
    next_of_kin_address: z.string().min(1, "Address is required"),
    next_of_kin_email: z.string().email("").optional(),
    is_next_of_kin_primary_contact: z.boolean().default(false).optional(),
    next_of_kin_alternate_phone_number: z
        .string()
        .min(10, "")
        .max(15, "")
        .optional(),
    next_of_kin_occupation: z.string().optional(),
    next_of_kin_workplace: z.string().optional(),

    // Sponsors Information
    first_school_leaving: z.instanceof(File).optional(),//to be changed to has_sponsor
    o_level: z.instanceof(File).optional(),
    hnd: z.instanceof(File).optional(),
    degree: z.instanceof(File).optional(),
    degree_transcript: z.instanceof(File).optional(),
    other_documents: z
        .array(z.instanceof(File))
        .optional()
        .refine((files) => files ? files.every(file => file.size <= MAX_FILE_SIZE) : true,
            {
                message: "Each file must be ≤ 5MB",
                path: ["fileSize"]
            }
        ).refine((files) => files ? files.every(file => ACCEPTED_FILE_TYPES.includes(file.type)) : true,
            {
                message: "Unsupported file type. Only images (JPEG, JPG, PNG, WEBP) and documents (PDF, DOC, DOCX) are allowed",
                path: ["fileType"]
            }
        ),

    // Academic Information  
    undergraduateDegree: z.string().min(1, 'Undergraduate degree is required'),
    university: z.string().min(2, 'University name is required'),
    gpa: z.string()
        .optional()
        .refine((val) => {
            if (!val) return true; // Allow undefined/empty values
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0 && num <= 5.0;
        }, 'GPA must be between 0.0 and 5.0'),
    graduationYear: z.string().min(4, 'Graduation year is required'),

    // Test Scores
    gmatScore: z.string().optional(),
    greScore: z.string().optional(),
    toeflScore: z.string().optional(),

    // Professional Experience
    workExperience: z.string().optional(),
    currentPosition: z.string().optional(),
    company: z.string().optional(),
    yearsOfExperience: z.string().optional(),

    // Program Selection
    startTerm: z.string().min(1, 'Start term is required'),
    studyMode: z.string().min(1, 'Study mode is required'),

    // Essays
    personalStatement: z
        .string()
        .min(100, 'Personal statement must be at least 100 characters')
        .max(255, "Personal statement must be under 255 characters")
        .nonempty("Personal statement is required"),
    careerGoals: z
        .string()
        .min(100, 'Career goals must be at least 100 characters')
        .max(250, "Career goals must be under 150 characters")
        .nonempty("Career goals is required"),

    // Additional Informationand terms-and-conditions
    has_disability: z.boolean().default(false),
    disability: z.string().optional().default("None"),
    agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to terms and conditions'),

    // Profile Picture
    passport: z.instanceof(File).optional(),

    // passport: z.string().optional(),
    awaiting_result: z.boolean().default(true),
})


export const admissionSchema = baseAdmissionSchema.superRefine((data, ctx) => {
    validateSponsorFields(data, ctx);
});

type SponsorCheck = {
    key: keyof AdmissionFormData;
    value: string | undefined;
    message: string;
    minLength?: number;
    validate?: () => boolean;
};

function validateSponsorFields(data: AdmissionFormData, ctx: z.RefinementCtx) {
    // Validate disability fields if has_disability is true
    if (data.has_disability && !data.disability) {
        ctx.addIssue({
            path: ['disability'],
            code: z.ZodIssueCode.custom,
            message: "Please describe your disability",
        });
    }

    // Validate sponsor fields if has_sponsor is true
    if (data.has_sponsor) {
        const checks: SponsorCheck[] = [
            {
                key: "sponsor_name",
                value: data.sponsor_name,
                minLength: 2,
                message: "Sponsor's name is required",
            },
            {
                key: "sponsor_relationship",
                value: data.sponsor_relationship,
                minLength: 2,
                message: "Sponsor's relationship is required",
            },
            // {
            //     key: "sponsor_email",
            //     value: data.sponsor_email,
            //     message: "Sponsor's email is required",
            //     validate: () => !!data.sponsor_email && /\S+@\S+\.\S+/.test(data.sponsor_email),
            // },
            {
                key: "sponsor_contact_address",
                value: data.sponsor_contact_address,
                minLength: 10,
                message: "Sponsor's contact address is required",
            },
            {
                key: "sponsor_phone_number",
                value: data.sponsor_phone_number,
                minLength: 10,
                message: "Sponsor's phone number is required",
            },
        ];

        for (const { key, value, message, minLength = 1, validate } of checks) {
            const isValid =
                typeof validate === "function"
                    ? validate()
                    : value && value.trim().length >= minLength;

            if (!isValid) {
                ctx.addIssue({
                    path: [key],
                    code: z.ZodIssueCode.custom,
                    message,
                });
            }
        }
    }
}


// EDITING THE FIELDS
//  Schema for personal info chunk
export const personalInfoSchema = baseSignupSchema.pick({
    email: true,
    phone_number: true,
    nationality: true,
}).extend({
    userId: baseSignupSchema.shape.id
});
export const personalInfoSchema2 = baseAdmissionSchema.pick({
    id: true,
    lga: true,
    dob: true,
    gender: true,
    hometown: true,
    hometown_address: true,
    contact_address: true,
    religion: true,
});
export const completePersonalInfoSchema = personalInfoSchema.merge(personalInfoSchema2);

// Schema for academic info chunk
export const academicInfoSchema = baseAdmissionSchema.pick({
    id: true,
    undergraduateDegree: true,
    university: true,
    gpa: true,
    graduationYear: true,
    gmatScore: true,
    greScore: true,
    toeflScore: true
});
// Schema for NextOfkin info chunk
export const nextOfkinInfoSchema = baseAdmissionSchema.pick({
    id: true,
    next_of_kin_name: true,
    next_of_kin_email: true,
    next_of_kin_phone_number: true,
    next_of_kin_relationship: true,
    next_of_kin_address: true,
    next_of_kin_occupation: true,
    next_of_kin_workplace: true
});
// Schema for Sponsor info chunk
export const sponsorInfoSchema = baseAdmissionSchema.pick({
    id: true,
    sponsor_name: true,
    sponsor_email: true,
    sponsor_phone_number: true,
    sponsor_relationship: true,
    sponsor_contact_address: true,
    has_sponsor: true,
});

export const workExoerienceInfoSchema = baseAdmissionSchema.pick({
    id: true,
    workExperience: true,
    currentPosition: true,
    company: true,
    yearsOfExperience: true,
});


export const programInfoSchema = baseSignupSchema.pick({
    program: true,
    program_id: true,
    academic_session: true,
});
export const programInfoSchema2 = baseAdmissionSchema.pick({
    id: true,
    studyMode: true,
    startTerm: true,
});
export const completeProgramInfoSchema = programInfoSchema.merge(programInfoSchema2);

export const otherInfoSchema = baseAdmissionSchema.pick({
    id: true,
    disability: true,
});

export const personalStatementInfoSchema = baseAdmissionSchema.pick({
    id: true,
    personalStatement: true,
});

export const careerGoalsInfoSchema = baseAdmissionSchema.pick({
    id: true,
    careerGoals: true,
});

export const qualificationDocumentsSchema = baseAdmissionSchema.pick({
    id: true,
    first_school_leaving: true,
    o_level: true,
    hnd: true,
    degree: true,
    degree_transcript: true,
    other_documents: true,
    // images: true,
});


export type AdmissionFormData = z.infer<typeof admissionSchema>;
export interface ApplicationDetailsType extends UserInterface {
    application: AdmissionFormData;
}

export type PersonalInfoData = z.infer<typeof completePersonalInfoSchema>;
export type AcademicInfoData = z.infer<typeof academicInfoSchema>;
export type NextOfkinInfoData = z.infer<typeof nextOfkinInfoSchema>;
export type SponsorInfoData = z.infer<typeof sponsorInfoSchema>;
export type WorkExoerienceInfoData = z.infer<typeof workExoerienceInfoSchema>;

export type ProgramInfoData = z.infer<typeof completeProgramInfoSchema>;
export type OtherInfoData = z.infer<typeof otherInfoSchema>;
export type PersonalStatementInfoData = z.infer<typeof personalStatementInfoSchema>;
export type CareerGoalsInfoData = z.infer<typeof careerGoalsInfoSchema>;
export type QualificationDocumentsData = z.infer<typeof qualificationDocumentsSchema>;


// Union type for all chunks
export type ApplicationChunk =
    | PersonalInfoData
    | AcademicInfoData
    | NextOfkinInfoData
    | SponsorInfoData
    | WorkExoerienceInfoData
    | ProgramInfoData
    | OtherInfoData
    | PersonalStatementInfoData
    | CareerGoalsInfoData
    | QualificationDocumentsData
