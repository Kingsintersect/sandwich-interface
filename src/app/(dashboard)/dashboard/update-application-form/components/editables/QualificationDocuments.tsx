"use client";

import { updateStudentApplicationData } from '@/app/actions/applications';
import { QualificationDocumentsData } from '@/schemas/admission-schema';
import { AlertCircle, CheckCircle, Edit3, FileStack, Save, X } from 'lucide-react';
import React, { useState } from 'react'
import { useApplicationReview } from '@/contexts/ApplicationReviewContext';
import { EditableFileUpload } from '@/components/forms/EditableFormFields';

export interface QualificationDocumentsProps {
    application: QualificationDocumentsData;
}

export default function QualificationDocuments({
    application,
}: QualificationDocumentsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    // Form state
    const [formData, setFormData] = useState<QualificationDocumentsData>({
        first_school_leaving: application.first_school_leaving || undefined,
        o_level: application.o_level || undefined,
        degree_transcript: application.degree_transcript || undefined,
        hnd: application.hnd || undefined,
        degree: application.degree || undefined,
        other_documents: application.other_documents || [],
        // images: application.images || [],
    });

    // Original data for cancel functionality
    const [originalData, setOriginalData] = useState<QualificationDocumentsData>(formData);
    const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [originalNewFiles, setOriginalNewFiles] = useState<File[]>([]);
    const { refetchApplication } = useApplicationReview();

    const handleEdit = () => {
        setOriginalData(formData); // Store current data as original
        setOriginalNewFiles([...newFiles]); // Store original new files
        setIsEditing(true);
        setSaveStatus('idle');
        setErrorMessage('');
    };

    const handleCancel = () => {
        setFormData(originalData); // Restore original data
        setNewFiles([...originalNewFiles]); // Restore original new files
        setIsEditing(false);
        setSaveStatus('idle');
        setErrorMessage('');
    };

    const savePersonalInfo = async (data: QualificationDocumentsData) => {
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
        // if (!formData.degree_transcript) {
        //     setErrorMessage('Degree information is required');
        //     setSaveStatus('error');
        //     return;
        // }

        try {
            setIsSaving(true);
            setSaveStatus('idle');
            setErrorMessage('');

            await savePersonalInfo(formData);

            setOriginalData(formData); // Update original data after successful save
            setOriginalNewFiles([...newFiles]); // Update original new files
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

    const updateField = (field: keyof QualificationDocumentsData, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (saveStatus === 'error') {
            setSaveStatus('idle');
            setErrorMessage('');
        }
    };

    // Enhanced change detection that includes new files
    const hasChanges = () => {
        // Check if form data changed
        const formDataChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

        // Check if new files changed
        const newFilesChanged = newFiles.length !== originalNewFiles.length ||
            newFiles.some((file, index) =>
                !originalNewFiles[index] ||
                file.name !== originalNewFiles[index].name ||
                file.size !== originalNewFiles[index].size
            );

        return formDataChanged || newFilesChanged;
    };

    const handleFilesChange = (files: File[]) => {
        setNewFiles(files);
        // Clear error when user makes changes
        if (saveStatus === 'error') {
            setSaveStatus('idle');
            setErrorMessage('');
        }
    };

    const handleImagesChange = (urls: string[]) => {
        updateField('other_documents', urls);
    };

    return (
        <div id='official-documents' className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header with Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileStack className="w-10 h-10 mr-2 text-purple-600" />
                    Qualification Documents
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
                                disabled={isSaving || isSavingPersonalInfo || !hasChanges()}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <EditableFileUpload
                    label="First school leaving certificate"
                    value={[`${formData.first_school_leaving}`]}
                    onChange={handleImagesChange} // Handle existing file URL changes
                    onFilesChange={handleFilesChange} // Handle new files
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    multiple={false}
                    maxFiles={1}
                    maxSize={10}
                    isEditing={isEditing}
                    baseUrl="https://uni-portal-system-backend.qverselearning.org/storage/" // For existing files
                    showPreview={true} // Enable/disable preview mode
                />
                <EditableFileUpload
                    label="O'Level certificate"
                    value={[`${formData.o_level}`]}
                    onChange={handleImagesChange} // Handle existing file URL changes
                    onFilesChange={handleFilesChange} // Handle new files
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    multiple={false}
                    maxFiles={1}
                    maxSize={10}
                    isEditing={isEditing}
                    baseUrl="https://uni-portal-system-backend.qverselearning.org/storage/" // For existing files
                    showPreview={true} // Enable/disable preview mode
                />
                <EditableFileUpload
                    label="Degree certificate"
                    value={[`${formData.degree}`]}
                    onChange={handleImagesChange} // Handle existing file URL changes
                    onFilesChange={handleFilesChange} // Handle new files
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    multiple={false}
                    maxFiles={1}
                    maxSize={10}
                    isEditing={isEditing}
                    baseUrl="https://uni-portal-system-backend.qverselearning.org/storage/" // For existing files
                    showPreview={true} // Enable/disable preview mode
                />
                <EditableFileUpload
                    label="HND certificate"
                    value={[`${formData.hnd}`]}
                    onChange={handleImagesChange} // Handle existing file URL changes
                    onFilesChange={handleFilesChange} // Handle new files
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    multiple={false}
                    maxFiles={1}
                    maxSize={10}
                    isEditing={isEditing}
                    baseUrl="https://uni-portal-system-backend.qverselearning.org/storage/" // For existing files
                    showPreview={true} // Enable/disable preview mode
                />
                <EditableFileUpload
                    label="Transcript Document"
                    value={[`${formData.degree_transcript}`]}
                    onChange={handleImagesChange} // Handle existing file URL changes
                    onFilesChange={handleFilesChange} // Handle new files
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    multiple={false}
                    maxFiles={1}
                    maxSize={10}
                    isEditing={isEditing}
                    baseUrl="https://uni-portal-system-backend.qverselearning.org/storage/" // For existing files
                    showPreview={true} // Enable/disable preview mode
                />
            </div>
            <hr className="my-5" />

            {/* multiple other document upload */}
            <EditableFileUpload
                label="Other relivant documents (you can add multiple files)"
                value={Array.isArray(formData.other_documents) ?
                    formData.other_documents.filter(item => typeof item === 'string') :
                    []}
                onChange={handleImagesChange} // Handle existing file URL changes
                onFilesChange={handleFilesChange} // Handle new files
                accept=".pdf,.doc,.docx,.jpg,.png"
                multiple={true}
                maxFiles={5}
                maxSize={10}
                isEditing={isEditing}
                baseUrl="https://uni-portal-system-backend.qverselearning.org/storage/" // For existing files
                showPreview={true} // Enable/disable preview mode
            />

            {/* Unsaved changes warning */}
            {isEditing && hasChanges() && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        You have unsaved changes. Make sure to save before leaving this section.
                    </p>
                </div>
            )}
        </div>
    );
}
