import { useApplicationReview } from '@/contexts/ApplicationReviewContext';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X } from 'lucide-react';
import React from 'react'

export const ApplicationReviewHeader = () => {
    const { currentApplication, handleDecision } = useApplicationReview();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Review Application</h1>
                        <p className="text-gray-600">UNIZIK Business School - Application Review</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {((currentApplication?.admission_status.toLowerCase() === 'pending') && isAdmin) && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleDecision('admitted')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Approve</span>
                                </button>
                                <button
                                    onClick={() => handleDecision('not_admitted')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Reject</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
