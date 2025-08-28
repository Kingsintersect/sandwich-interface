"use client";

import { updateStudentApplicationData } from '@/app/actions/applications';
import { ProgramInfoData } from '@/schemas/admission-schema';
import { AlertCircle, Award, CheckCircle, Edit3, Save, X } from 'lucide-react';
import React, { useState } from 'react'
import { ACADEMIC_SESSION, STUDY_MODES } from '@/components/forms/applicationFormConstants';
import { useExternalPrograms } from '@/hooks/useExternalPrograms'; // Your programs hook
import { useApplicationReview } from '@/contexts/ApplicationReviewContext';
import { EditableProgramOptions, EditableRadioGroup, EditableSelect } from '@/components/forms/EditableFormFields';

export interface ProgramInfoProps {
    application: ProgramInfoData;
}

export default function ProgramInfo({
    application,
}: ProgramInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Load programs data
    const { data: programs, isLoading, isError } = useExternalPrograms();

    // Form state
    const [formData, setFormData] = useState<ProgramInfoData>({
        program: application.program || '',
        program_id: (application.program_id as string) || '',
        studyMode: application.studyMode || '',
        startTerm: application.startTerm || '',
        academic_session: application.academic_session || '',
    });

    // Original data for cancel functionality
    const [originalData, setOriginalData] = useState<ProgramInfoData>(formData);
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

    const savePersonalInfo = async (data: ProgramInfoData) => {
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
        if (!formData.program || !formData.startTerm) {
            setErrorMessage('Program and start term are required');
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

    const updateField = (field: keyof ProgramInfoData, value: string) => {
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
                    <Award className="w-10 h-10 mr-2 text-blue-600" />
                    Program of choice
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

            {/* Editable Fields */}
            <div className="grid grid-cols-1 gap-4">
                <EditableProgramOptions
                    label="Selected Programme"
                    value={formData.program}
                    onChange={(value) => updateField('program', value)}
                    onIdChange={(id) => updateField('program_id', id)}
                    isEditing={isEditing}
                    programs={programs}
                    isLoading={isLoading}
                    isError={isError}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableRadioGroup
                        label="Study Mode"
                        value={formData.studyMode}
                        onChange={(value) => updateField('studyMode', value)}
                        options={STUDY_MODES}
                        isEditing={isEditing}
                    />

                    <EditableSelect
                        label="Academic Session"
                        value={formData.academic_session}
                        onChange={(value) => updateField('academic_session', value)}
                        options={ACADEMIC_SESSION}
                        isEditing={isEditing}
                    />
                </div>
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