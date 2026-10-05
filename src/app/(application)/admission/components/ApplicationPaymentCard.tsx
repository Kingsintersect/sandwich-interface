"use client";

import { Button } from '@/components/ui/button';
import { APPLICATION_FEE } from '@/config';
import { formatToCurrency } from '@/lib/utils';
import {
    ArrowRight01Icon,
    CreditCardIcon,
    File01Icon,
    Loading03Icon,
    ShieldCheckIcon,
} from '@hugeicons/core-free-icons';
import { Icon } from '@/components/ui/icon';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react'
import { useApplicationFormPurchase } from '@/hooks/usePayments';
import { toastApiError } from '@/lib/toastApiError';

type ApplicationPaymentCardProps = {
    access_token: string | null;
    /** Wording for the button and error toast. */
    feeLabel?: string;
};

export const ApplicationPaymentCard = ({
    access_token,
    feeLabel = 'Application fee',
}: ApplicationPaymentCardProps) => {
    const router = useRouter();

    const { mutate, data, isPending, isError, error } = useApplicationFormPurchase();

    const handlePayApplicationFee = useCallback((url: string) => {
        router.push(url);
    }, [router]);

    useEffect(() => {
        if (data?.status === 200) {
            const url = data?.data?.authorizationUrl as string | undefined;
            if (url) handlePayApplicationFee(url);
            else toastApiError(null, 'The payment gateway did not return a checkout link');
        } else if (isError) {
            toastApiError(error, `Failed to start your ${feeLabel.toLowerCase()} payment`);
        }
    }, [data, isError, error, handlePayApplicationFee, feeLabel]);

    return (
        <div className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-soft">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600 dark:bg-ocean-900/50 dark:text-ocean-300">
                    <Icon icon={File01Icon} className="size-8" />
                </div>
                <h3 className="mb-2 text-2xl font-semibold text-ocean-900 dark:text-foreground">
                    Ready to begin your application
                </h3>
                <p className="text-muted-foreground">
                    Your account has been created successfully. Let’s start your admission process.
                </p>
            </div>

            {/* Call to action */}
            <div className="crest-surface relative overflow-hidden rounded-2xl p-6 text-center">
                <span className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-ember-500/25 blur-[100px]" />

                <div className="relative">
                    <h4 className="mb-2 text-xl font-semibold text-white">
                        Start your application process
                    </h4>
                    <p className="mb-6 text-sm text-white/70">
                        Pay the application fee to unlock the admission form and begin your journey with us.
                    </p>

                    <Button
                        onClick={() => access_token && mutate({ access_token })}
                        disabled={isPending || !access_token}
                        size="lg"
                        className="ember-surface group rounded-full text-base font-semibold text-white shadow-ember hover:bg-none hover:bg-ember-700"
                    >
                        <Icon
                            icon={isPending ? Loading03Icon : CreditCardIcon}
                            className={isPending ? 'size-5 animate-spin' : 'size-5'}
                        />
                        {isPending
                            ? 'Starting payment…'
                            : `Pay ${feeLabel.toLowerCase()} — ${formatToCurrency(APPLICATION_FEE)}`}
                        {!isPending && (
                            <Icon
                                icon={ArrowRight01Icon}
                                className="size-5 transition-transform group-hover:translate-x-0.5"
                            />
                        )}
                    </Button>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/60">
                        <Icon icon={ShieldCheckIcon} className="size-3.5" />
                        Secure payment · Multiple payment options available
                    </p>
                </div>
            </div>
        </div>
    )
}
