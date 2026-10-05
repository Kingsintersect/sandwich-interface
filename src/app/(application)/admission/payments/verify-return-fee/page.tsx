"use client";

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';
import { baseUrl } from '@/config'
import { PaymentVerificationCard } from '../components/PaymentVerificationCard';
import { useReturnFeeVerification } from '@/hooks/usePaymentVerification';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Where the gateway returns a student after the returning fee.
 *
 * Verified through `GET /verify-return-fee-payment?transRef=`, then the student
 * goes back to their dashboard. The payment history query is invalidated on the
 * way out because the fee notice reads it to decide whether the fee is still
 * outstanding, and it would otherwise keep showing a paid fee as owing.
 */
const VerifyReturnFeePayment = () => {
   const searchParams = useSearchParams();
   const transRef = searchParams.get('transRef');
   const [isReloading, setIsReloading] = useState(false);
   const { access_token, refreshUserData } = useAuth();
   const queryClient = useQueryClient();
   const [verificationResult, setVerificationResult] = useState<{
      status: string;
      message: string;
      amount?: number;
      paymentDate?: string;
   } | null>(null);

   const router = useRouter();
   const { mutate: verifyPayment, isPending } = useReturnFeeVerification();

   useEffect(() => {
      if (!transRef) {
         toast.error('Payment reference is missing');
         router.push(`${baseUrl}/dashboard/student`);
      }
   }, [transRef, router]);

   const handleVerify = () => {
      if (!transRef || !access_token) return;

      verifyPayment(
         { transRef, access_token },
         {
            onSuccess: (data) => {
               setVerificationResult(data);
            },
         }
      );
   };

   const handleRedirect = async () => {
      setIsReloading(true);
      await refreshUserData();
      queryClient.invalidateQueries({ queryKey: ['student-payment-history'] });
      setIsReloading(false);
      router.push(`${baseUrl}/dashboard/student`);
      router.refresh();
   }

   if (!transRef) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="text-center">
               <h1 className="mb-2 text-2xl font-bold text-ocean-900 dark:text-foreground">
                  Invalid request
               </h1>
               <p className="text-muted-foreground">A payment reference is required.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
         <PaymentVerificationCard
            paymentRef={transRef}
            isVerifying={isPending || isReloading}
            verificationResult={verificationResult}
            onVerify={handleVerify}
            onProceed={handleRedirect}
            autoVerify={false}
         />
      </div>
   )
}

export default VerifyReturnFeePayment
