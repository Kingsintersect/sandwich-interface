import React from 'react';
import { Upload, X, FileText, Eye, ZoomIn, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ImagePreviewModal } from '@/components/application/ImagePreviewModal';
import { DetachedProgramAccordionDisplay, ProgramNode } from './DetachedProgramAccordionDisplay';
// import { ProgramRequirementsLink } from '@/components/requirements/ProgramRequirementsModal';

// Reusable Input Component
export const EditableField: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'tel' | 'date' | "number";
    placeholder?: string;
    isEditing: boolean;
    className?: string;
}> = ({ label, value, onChange, type = 'text', placeholder, isEditing, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                value={value ?? undefined}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </p>
        )}
    </div>
);

// Textarea Component for longer content
export const EditableTextArea: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    isEditing: boolean;
    className?: string;
    rows?: number;
}> = ({ label, value, onChange, placeholder, isEditing, className, rows = 3 }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {isEditing ? (
            <textarea
                value={value ?? undefined}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm resize-vertical"
            />
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </p>
        )}
    </div>
);



// Radio Button Component
export const EditableRadioGroup: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    isEditing: boolean;
    className?: string;
}> = ({ label, value, onChange, options, isEditing, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        {isEditing ? (
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center">
                        <input
                            type="radio"
                            name={label.replace(/\s+/g, '_').toLowerCase()}
                            value={option.value ?? undefined}
                            checked={value === option.value}
                            onChange={(e) => onChange(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-900">{option.label}</span>
                    </label>
                ))}
            </div>
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {options.find(opt => opt.value === value)?.label ||
                    <span className="text-gray-400 italic">Not selected</span>}
            </p>
        )}
    </div>
);

// Checkbox Component
export const EditableCheckbox: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    isEditing: boolean;
    className?: string;
    description?: string;
}> = ({ label, checked, onChange, isEditing, className, description }) => (
    <div className={className}>
        {isEditing ? (
            <label className="flex items-start">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
            </label>
        ) : (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${checked
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {checked ? 'Yes' : 'No'}
                    </span>
                </p>
            </div>
        )}
    </div>
);

// Select Menu Component
export const EditableSelect: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    isEditing: boolean;
    className?: string;
}> = ({ label, value, onChange, options, placeholder = "Select an option", isEditing, className }) => {
    // Normalize the value for comparison
    const normalizedValue = value?.toLowerCase();
    const selectedOption = options.find(opt => opt.value.toLowerCase() === normalizedValue);

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {isEditing ? (
                <select
                    value={selectedOption?.value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm bg-white"
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                    {selectedOption?.label || <span className="text-gray-400 italic">Not selected</span>}
                </p>
            )}
        </div>
    );
}

// Updated EditableProgramOptions component
interface EditableProgramOptionsProps {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    onIdChange?: (id: string) => void; // Optional callback for program ID
    placeholder?: string;
    isEditing: boolean;
    className?: string;
    programs?: ProgramNode[];
    isLoading?: boolean;
    isError?: boolean;
}

export const EditableProgramOptions: React.FC<EditableProgramOptionsProps> = ({
    label,
    value,
    onChange,
    onIdChange,
    // placeholder = "Select program options",
    isEditing,
    className,
    programs,
    isLoading,
    isError,
}) => {
    const handleProgramSelect = (program: { id: number; name: string }) => {
        onChange(program.name);
        if (onIdChange) {
            onIdChange(String(program.id));
        }
    };

    return (
        <div className={className}>
            {/* <ProgramRequirementsLink className="text-xs" /> */}
            {/* <ProgramRequirementsLink
                className="ml-20 text-xs text-orange-600  animate-bounce"
                downloadUrl="/documents/PROGRAMME_AND_REQUIREMENTS.docx"
            /> */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            {/* Hidden input to store the selected value */}
            <input
                type="hidden"
                value={value || ''}
                name="program"
            />

            {isEditing ? (
                <>
                    {isLoading && (
                        <div className='w-full flex items-center justify-center py-8'>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                            Loading Programs...
                        </div>
                    )}

                    {(isError || !programs) && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-800">Failed to load programs. Please try again.</p>
                            </div>
                        </div>
                    )}

                    {programs && !isLoading && !isError && (
                        <DetachedProgramAccordionDisplay
                            programs={programs}
                            selectedValue={value || undefined}
                            onProgramSelect={handleProgramSelect}
                            subHeading="Select any program from the parent to the child program..."
                        />
                    )}
                </>
            ) : (
                <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                    {value || <span className="text-gray-400 italic">Not selected</span>}
                </p>
            )}
        </div>
    );
};
// Date Component
export const EditableDate: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isEditing: boolean;
    className?: string;
    min?: string;
    max?: string;
}> = ({ label, value, onChange, placeholder, isEditing, className, min, max }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {isEditing ? (
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {value ? new Date(value).toLocaleDateString() :
                    <span className="text-gray-400 italic">Not provided</span>}
            </p>
        )}
    </div>
);

// File Upload/Preview Component
type FileItem = {
    file?: File;
    url?: string;
    name: string;
    size?: number;
    type?: string;
    isImage?: boolean;
};

export const EditableFileUpload: React.FC<{
    label: string;
    value: string[]; // URLs from database
    onChange: (urls: string[]) => void; // Return URLs for database storage
    onFilesChange?: (files: File[]) => void; // Optional callback for new files
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number; // in MB
    isEditing: boolean;
    className?: string;
    baseUrl?: string; // Base URL for displaying images
    showPreview?: boolean; // Whether to show preview thumbnails
}> = ({
    label,
    value = [],
    onChange,
    onFilesChange,
    accept = "*/*",
    multiple = false,
    maxFiles = 5,
    maxSize = 10,
    isEditing,
    className,
    baseUrl = "",
    showPreview = true
}) => {
        const [newFiles, setNewFiles] = React.useState<File[]>([]);
        const [previewImage, setPreviewImage] = React.useState<string | null>(null);
        const [previewImageName, setPreviewImageName] = React.useState<string>('');
        const [isModalOpen, setIsModalOpen] = React.useState(false);

        // Convert existing URLs and new files to unified format
        const allFiles: FileItem[] = [
            ...value.map(url => {
                const isImage = isImageFile(url);
                return {
                    url,
                    name: url.split('/').pop() || 'Unknown file',
                    type: isImage ? 'image' : 'document',
                    isImage
                };
            }),
            ...newFiles.map(file => ({
                file,
                name: file.name,
                size: file.size,
                type: file.type.startsWith('image/') ? 'image' : 'document',
                isImage: file.type.startsWith('image/')
            }))
        ];

        function isImageFile(url: string): boolean {
            const extension = url.split('.').pop()?.toLowerCase();
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
            return imageExtensions.includes(extension || '');
        }

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = Array.from(e.target.files || []);

            // Validate file size
            const validFiles = selectedFiles.filter(file => {
                if (file.size > maxSize * 1024 * 1024) {
                    alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
                    return false;
                }
                return true;
            });

            // Limit total number of files
            const totalFiles = value.length + newFiles.length + validFiles.length;
            if (totalFiles > maxFiles) {
                const allowedCount = maxFiles - value.length - newFiles.length;
                if (allowedCount > 0) {
                    validFiles.splice(allowedCount);
                    alert(`Only ${allowedCount} more files can be added. Maximum is ${maxFiles} files.`);
                } else {
                    alert(`Maximum ${maxFiles} files allowed.`);
                    return;
                }
            }

            const updatedNewFiles = multiple ?
                [...newFiles, ...validFiles] :
                validFiles.slice(0, 1);

            setNewFiles(updatedNewFiles);

            // Callback for parent component to handle new files
            if (onFilesChange) {
                onFilesChange(updatedNewFiles);
            }
        };

        const removeFile = (index: number) => {
            if (index < value.length) {
                // Remove existing file (URL)
                const newUrls = value.filter((_, i) => i !== index);
                onChange(newUrls);
            } else {
                // Remove new file
                const newFileIndex = index - value.length;
                const updatedNewFiles = newFiles.filter((_, i) => i !== newFileIndex);
                setNewFiles(updatedNewFiles);
                if (onFilesChange) {
                    onFilesChange(updatedNewFiles);
                }
            }
        };

        const formatFileSize = (bytes?: number) => {
            if (!bytes || bytes === 0) return 'Unknown size';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        const getImageUrl = (fileItem: FileItem) => {
            if (fileItem.url) {
                return fileItem.url.startsWith('http') ? fileItem.url : baseUrl + fileItem.url;
            }
            if (fileItem.file) {
                return URL.createObjectURL(fileItem.file);
            }
            return '';
        };

        const getDocumentUrl = (fileItem: FileItem) => {
            if (fileItem.url) {
                return fileItem.url.startsWith('http') ? fileItem.url : baseUrl + fileItem.url;
            }
            if (fileItem.file) {
                return URL.createObjectURL(fileItem.file);
            }
            return '';
        };

        const handleImagePreview = (fileItem: FileItem) => {
            const imageUrl = getImageUrl(fileItem);
            setPreviewImage(imageUrl);
            setPreviewImageName(fileItem.name);
            setIsModalOpen(true);
        };

        const handleDocumentPreview = (fileItem: FileItem) => {
            const documentUrl = getDocumentUrl(fileItem);
            if (documentUrl) {
                window.open(documentUrl, '_blank');
            }
        };

        // First, update the FilePreview component to use fixed dimensions
        const FilePreview: React.FC<{ fileItem: FileItem; index: number }> = ({ fileItem, index }) => {
            return (
                <div className="relative group w-full aspect-square"> {/* Square container */}
                    {fileItem.isImage ? (
                        <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <Image
                                src={getImageUrl(fileItem)}
                                alt={fileItem.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) {
                                        fallback.classList.remove('hidden');
                                        fallback.classList.add('flex');
                                    }
                                }}
                            />
                            <div className="hidden w-full h-full items-center justify-center absolute inset-0 bg-gray-100">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleDocumentPreview(fileItem)}
                        >
                            <FileText className="w-8 h-8 text-gray-500" />
                        </div>
                    )}

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => fileItem.isImage ? handleImagePreview(fileItem) : handleDocumentPreview(fileItem)}
                                className="p-1.5 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                                title={fileItem.isImage ? "Preview" : "Open"}
                            >
                                {fileItem.isImage ? <ZoomIn className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1.5 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                                    title="Remove"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* File info at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm rounded-b-lg">
                        <p className="text-xs font-medium text-gray-800 truncate" title={fileItem.name}>
                            {fileItem.name}
                        </p>
                        {fileItem.size && (
                            <p className="text-xs text-gray-500">{formatFileSize(fileItem.size)}</p>
                        )}
                    </div>
                </div>
            );
        };

        // Special rendering for single file upload
        const renderSingleFileUpload = () => {
            const fileItem = allFiles[0];
            const isEmpty = allFiles.length === 0;

            return (
                <div className="flex flex-col">
                    {isEmpty ? (
                        isEditing ? (
                            // Edit mode - show upload prompt
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                <input
                                    type="file"
                                    accept={accept}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id={`file-upload-${label.replace(/\s+/g, '_').toLowerCase()}`}
                                />
                                <label
                                    htmlFor={`file-upload-${label.replace(/\s+/g, '_').toLowerCase()}`}
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload file</p>
                                    <p className="text-xs text-gray-500 mt-1">Max {maxSize}MB</p>
                                </label>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 italic">No file/document uploaded</div>
                        )
                    ) : showPreview ? (
                        // Show preview when enabled
                        <div className="border rounded-lg bg-gray-50 overflow-hidden">
                            {fileItem.isImage ? (
                                // Image preview - fill/cover the upload box
                                <>
                                    <div className="relative w-full h-32 bg-gray-200">
                                        <Image
                                            src={getImageUrl(fileItem)}
                                            alt={fileItem.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {isEditing && (
                                            <div className="absolute top-2 right-2 flex space-x-1">
                                                <button
                                                    onClick={() => handleImagePreview(fileItem)}
                                                    className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
                                                    title="Preview"
                                                >
                                                    <ZoomIn className="w-4 h-4 text-gray-700" />
                                                </button>
                                                <button
                                                    onClick={() => removeFile(0)}
                                                    className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
                                                    title="Remove"
                                                >
                                                    <X className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* Image information displayed under */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <ImageIcon className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm font-medium truncate">
                                                    {fileItem.name}
                                                </span>
                                            </div>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => handleImagePreview(fileItem)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Preview"
                                                >
                                                    <ZoomIn className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{formatFileSize(fileItem.size)}</span>
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleFileInputClick()}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Change file
                                                </button>
                                            )}
                                        </div>
                                        <div className="w-full flex items-center justify-center mt-2">
                                            <button
                                                onClick={() => handleImagePreview(fileItem)}
                                                className="text-blue-500 hover:text-blue-700"
                                                title="Preview"
                                            >
                                                <ZoomIn className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Document preview - centered icon with filename under
                                <div className="px-8 py-3 text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <FileText className="w-16 h-16 text-blue-500" />
                                        <div className="w-full">
                                            <p className="text-sm font-medium text-gray-800 truncate px-4" title={fileItem.name}>
                                                {fileItem.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatFileSize(fileItem.size)}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDocumentPreview(fileItem)}
                                                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                                                title="Open"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {isEditing && (
                                                <>
                                                    <button
                                                        onClick={() => removeFile(0)}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                                        title="Remove"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show simple list when preview is disabled
                        <div className="flex items-center">
                            {fileItem.isImage ? (
                                <ImageIcon className="w-4 h-4 mr-2 text-gray-500" />
                            ) : (
                                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                            )}
                            <span className="text-sm text-gray-800 truncate">
                                {fileItem.name}
                            </span>
                        </div>
                    )}
                </div>
            );
        };

        const handleFileInputClick = () => {
            const input = document.getElementById(`file-upload-${label.replace(/\s+/g, '_').toLowerCase()}`) as HTMLInputElement;
            if (input) {
                input.value = ''; // Reset to allow re-selecting the same file
                input.click();
            }
        };

        return (
            <>
                <div className={className}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>

                    {!multiple ? (
                        renderSingleFileUpload()
                    ) : (
                        <>
                            {allFiles.length > 0 ? (
                                showPreview ? (
                                    <div className="mb-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {allFiles.map((fileItem, index) => (
                                                <FilePreview key={index} fileItem={fileItem} index={index} />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {allFiles.map((fileItem, index) => (
                                            <div key={index} className="flex items-center">
                                                {fileItem.isImage ? (
                                                    <ImageIcon className="w-4 h-4 mr-2 text-gray-500" />
                                                ) : (
                                                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                )}
                                                <span className="text-sm text-gray-800">
                                                    {fileItem.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="text-sm text-gray-400 italic">No files/documents uploaded</div>
                            )}

                            {isEditing && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        accept={accept}
                                        multiple={multiple}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id={`file-upload-${label.replace(/\s+/g, '_').toLowerCase()}`}
                                    />
                                    <label
                                        htmlFor={`file-upload-${label.replace(/\s+/g, '_').toLowerCase()}`}
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">
                                            Click to upload files
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Max {maxSize}MB (up to {maxFiles} files)
                                        </p>
                                    </label>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <ImagePreviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    imageUrl={previewImage || ''}
                    imageName={previewImageName}
                />
            </>
        );
    };
