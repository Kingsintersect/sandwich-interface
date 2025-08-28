"use client";

import { updateStudentApplicationData } from '@/app/actions/applications';
import { NextOfkinInfoData } from '@/schemas/admission-schema';
import { AlertCircle, CheckCircle, Edit3, ContactRound, Save, X } from 'lucide-react';
import React, { useState } from 'react'
import { EditableField } from '../../../../../../components/forms/EditableFormFields';
import { useApplicationReview } from '@/contexts/ApplicationReviewContext';

export interface NextOfkinInfoProps {
    application: NextOfkinInfoData;
}
export default function NextOfkinInfo({
    application,
}: NextOfkinInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Form state
    const [formData, setFormData] = useState<NextOfkinInfoData>({
        next_of_kin_name: application.next_of_kin_name || '',
        next_of_kin_email: application.next_of_kin_email || '',
        next_of_kin_phone_number: application?.next_of_kin_phone_number || '',
        next_of_kin_relationship: application.next_of_kin_relationship || '',
        next_of_kin_address: (application.next_of_kin_address as string) || '',
        next_of_kin_occupation: application.next_of_kin_occupation || '',
        next_of_kin_workplace: application.next_of_kin_workplace || '',
    });

    // Original data for cancel functionality
    const [originalData, setOriginalData] = useState<NextOfkinInfoData>(formData);
    const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);
    const { refetchApplication } = useApplicationReview();

    const handleEdit = () => {
        setOriginalData(formData); // Store current data as original
        setIsEditing(true);
        setSaveStatus('idle');
        setErrorMessage('');
    };

    const handleCancel = () => {
        setFormData(originalData); // Restore original data
        setIsEditing(false);
        setSaveStatus('idle');
        setErrorMessage('');
    };
    const savePersonalInfo = async (data: NextOfkinInfoData) => {
        setIsSavingPersonalInfo(true);
        try {
            await updateStudentApplicationData(String(application.id), data);
            // Optionally refresh the application data
            await refetchApplication();
        } catch (error) {
            console.error('Failed to save personal info:', error);
            throw error; // Re-throw to let component handle the error display
        } finally {
            setIsSavingPersonalInfo(false);
        }
    };

    const handleSave = async () => {

        // Basic validation
        if (!formData.next_of_kin_name || !formData.next_of_kin_phone_number) {
            setErrorMessage('next of kin`s name and next of kin`s phone number are required');
            setSaveStatus('error');
            return;
        }

        try {
            setIsSaving(true);
            setSaveStatus('idle');
            setErrorMessage('');

            await savePersonalInfo(formData);

            setOriginalData(formData); // Update original data after successful save
            setIsEditing(false);
            setSaveStatus('success');

            // Clear success message after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Save failed:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to save changes');
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof NextOfkinInfoData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (saveStatus === 'error') {
            setSaveStatus('idle');
            setErrorMessage('');
        }
    };

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header with Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ContactRound className="w-10 h-10 mr-2 text-emerald-600" />
                    Next Of Kin Details
                </h3>

                <div className="flex items-center space-x-2">
                    {/* Status indicators */}
                    {saveStatus === 'success' && (
                        <div className="flex items-center text-green-600 text-sm mr-2">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Saved successfully
                        </div>
                    )}

                    {saveStatus === 'error' && (
                        <div className="flex items-center text-red-600 text-sm mr-2">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Error
                        </div>
                    )}

                    {/* Action buttons */}
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || isSavingPersonalInfo || !hasChanges}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3 h-3 mr-1.5" />
                                        Save
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving || isSavingPersonalInfo}
                                className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <X className="w-3 h-3 mr-1.5" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEdit}
                            disabled={isSavingPersonalInfo}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Edit3 className="w-3 h-3 mr-1.5" />
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Error message */}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                        <p className="text-sm text-red-800">{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                    label="Full Name"
                    type="text"
                    value={formData.next_of_kin_name}
                    onChange={(value) => updateField('next_of_kin_name', value)}
                    placeholder="name of your next of kin"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Email"
                    type="text"
                    value={String(formData.next_of_kin_email)}
                    onChange={(value) => updateField('next_of_kin_email', value)}
                    placeholder="Email address of nexr of kin"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Phone Number"
                    type="text"
                    value={formData.next_of_kin_phone_number}
                    onChange={(value) => updateField('next_of_kin_phone_number', value)}
                    placeholder='Phone number of next of kin'
                    isEditing={isEditing}
                />

                <EditableField
                    label="Relationship"
                    type='text'
                    value={formData.next_of_kin_relationship}
                    onChange={(value) => updateField('next_of_kin_relationship', value)}
                    placeholder="e.g Father, Mother, Brother, Sister..."
                    isEditing={isEditing}
                />

                <EditableField
                    label="Address"
                    type='text'
                    value={formData.next_of_kin_address ?? ""}
                    onChange={(value) => updateField('next_of_kin_address', value)}
                    placeholder="Address of next of kin"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Occupation"
                    type="text"
                    value={formData.next_of_kin_occupation || ''}
                    onChange={(value) => updateField('next_of_kin_occupation', value)}
                    placeholder="Occupation of next of kin"
                    isEditing={isEditing}
                />
                <EditableField
                    label="Workplace"
                    type="text"
                    value={formData.next_of_kin_workplace || ''}
                    onChange={(value) => updateField('next_of_kin_workplace', value)}
                    placeholder="Workplace of next of kin"
                    isEditing={isEditing}
                />
            </div>

            {/* Unsaved changes warning */}
            {isEditing && hasChanges && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        You have unsaved changes. Make sure to save before leaving this section.
                    </p>
                </div>
            )}
        </div>
    );
}