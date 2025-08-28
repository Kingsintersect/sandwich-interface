import { FileUploadFormField } from '@/components/forms/FormField';
import { AdmissionFormData } from '@/schemas/admission-schema';
import React from 'react'
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';


interface AcademicCredentialsStepProps {
	control: Control<AdmissionFormData>;
	setValue: UseFormSetValue<AdmissionFormData>;
	watch: UseFormWatch<AdmissionFormData>;
	errors: FieldErrors<AdmissionFormData>;
}

export const AcademicCredentialsStep: React.FC<AcademicCredentialsStepProps> = ({
	control,
	errors,
	// setValue,
	// watch
}) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-5 space-y-5">
			<FileUploadFormField
				name="first_school_leaving"
				label="Primary School Leaving Certificate"
				control={control}
				errors={errors}
				accept=".pdf,.doc,.docx,.jpg,.png"
				multiple={false}
				showPreview={true}
				className='sm:col-span-2 md:col-span-2'
			/>
			{/* Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, voluptatum laborum voluptate minima soluta architecto accusantium rem porro magni voluptas! */}
			<FileUploadFormField
				name="o_level"
				label="Ordinary Level (O'Level) Certificate"
				control={control}
				errors={errors}
				accept=".pdf,.doc,.docx,.jpg,.png"
				multiple={false}
				showPreview={true}
				className='sm:col-span-2 md:col-span-2'
			/>

			<FileUploadFormField
				name="hnd"
				label="Higher National Diploma (HND) certificate"
				control={control}
				errors={errors}
				accept=".pdf,.doc,.docx,.jpg,.png"
				multiple={false}
				showPreview={true}
				className='sm:col-span-2 md:col-span-2'
			/>

			<FileUploadFormField
				name="degree"
				label="Degree Certificate"
				control={control}
				errors={errors}
				accept=".pdf,.doc,.docx,.jpg,.png"
				multiple={false}
				showPreview={true}
				className='sm:col-span-2 md:col-start-2'
			/>

			<FileUploadFormField
				name="degree_transcript"
				label="Degree Transcript (You can upload later if not available)"
				control={control}
				errors={errors}
				accept=".pdf,.doc,.docx,.jpg,.png"
				multiple={false}
				showPreview={true}
				className='sm:col-span-2 md:col-start-4'
			/>

			<FileUploadFormField
				name="other_documents"
				label="Other Accademic Qualification Documents (Upload multiple files/images clear image of the document)"
				control={control}
				errors={errors}
				accept=".pdf,.doc,.docx"
				multiple={true}
				showPreview={true}
				className='sm:col-span-full md:col-span-4 md:col-start-2'
			/>
		</div>
	);
};




// interface AcademicCredentialsStepProps {
// 	control: Control<AdmissionFormData>;
// 	setValue: UseFormReturn<AdmissionFormData>['setValue'];
// 	watch: UseFormWatch<AdmissionFormData>;
// 	errors: FieldErrors<AdmissionFormData>;
// }
// export const AcademicCredentialsStep: React.FC<AcademicCredentialsStepProps> = ({ control, errors, setValue, watch }) => {
// 	return (
// 		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 space-y-6">
// 			<EditableFileUpload
// 				label="Primary School Leaving Certificate"
// 				value={watch('first_school_leaving')}
// 				onChange={(urls) => setValue('first_school_leaving', urls)}
// 				isEditing={true}
// 				accept=".pdf,.doc,.docx,.jpg,.png"
// 				multiple={false}
// 				showPreview={true}
// 			/>
// 			<EditableFileUpload
// 				label="Odinary Level (O`Level) certificate"
// 				value={watch('o_level')}
// 				onChange={(urls) => setValue('o_level', urls)}
// 				isEditing={true}
// 				accept=".pdf,.doc,.docx,.jpg,.png"
// 				multiple={false}
// 				showPreview={true}
// 			/>
// 			<EditableFileUpload
// 				label="Odinary National Diploma (OND) certificate"
// 				value={watch('degree')}
// 				onChange={(urls) => setValue('degree', urls)}
// 				isEditing={true}
// 				accept=".pdf,.doc,.docx,.jpg,.png"
// 				multiple={false}
// 				showPreview={true}
// 			/>
// 			<EditableFileUpload
// 				label="Higher National Diploma (HND) certificate"
// 				value={watch('hnd')}
// 				onChange={(urls) => setValue('hnd', urls)}
// 				isEditing={true}
// 				accept=".pdf,.doc,.docx,.jpg,.png"
// 				multiple={false}
// 				showPreview={true}
// 			/>
// 			<EditableFileUpload
// 				label="Profile Picture"
// 				value={watch('degree_transcript')}
// 				onChange={(urls) => setValue('degree_transcript', urls)}
// 				isEditing={true}
// 				accept=".pdf,.doc,.docx,.jpg,.png"
// 				multiple={false}
// 				showPreview={true}
// 			/>

// 			<PhotoUploader
// 				onFileChange={(file) => setValue('degree_transcript', file ?? undefined)}
// 				error={errors.hnd?.message}
// 				setValue={setValue}
// 				title='Upload your degree_transcript document'
// 			/>
// 			<div className="col-span-full">
// 				<MultiImageUploader
// 					imagesUrlArray={undefined}
// 					productId={0}
// 					register={control.register}
// 					setValue={setValue}
// 					formKey='other_documents'
// 				/>
// 			</div>
// 		</div>
// 	)
// }
