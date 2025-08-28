"use client";

import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { ApplicationDetails } from './ApplicationDetails';
import { DecisionModal } from './DecisionModal';
import { useApplicationQuery, useApplicationReview } from '@/contexts/ApplicationReviewContext';

export const ApplicationContainer = ({ id }: { id: string }) => {
    const {
        isLoading: isSubmittingApplication,
        showDecisionModal,
        decisionType,
        closeDecisionModal,
        submitDecision,
    } = useApplicationReview();

    const { data: application, isLoading, error } = useApplicationQuery(id);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <ApplicationDetails
                isLoading={isLoading}
                error={error?.message ?? null}
                application={application as ApplicationDetailsType}
            />

            {showDecisionModal && application && (
                <DecisionModal
                    decisionType={decisionType}
                    onClose={closeDecisionModal}
                    onSubmit={submitDecision}
                    application={application}
                    isLoading={isSubmittingApplication}
                />
            )}
        </div>
    );
};
