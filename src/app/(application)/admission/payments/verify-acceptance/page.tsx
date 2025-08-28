"use client";

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { baseUrl } from '@/config'
import { PaymentVerificationCard } from '../components/PaymentVerificationCard';
import { toast } from 'sonner';
import { useAcceptanceVerification } from '@/hooks/usePaymentVerification';
import { useAuth } from '@/contexts/AuthContext';

const VerifyAcceptance = () => {
   const searchParams = useSearchParams();
   const transRef = searchParams.get('transRef');
   const { access_token } = useAuth();
   const [verificationResult, setVerificationResult] = useState<{
      status: string;
      message: string;
      amount?: number;
      paymentDate?: string;
   } | null>(null);

   const router = useRouter();
   const { mutate: verifyAcceptancePayment, isPending } = useAcceptanceVerification();

   useEffect(() => {
      if (!transRef) {
         toast.error('Payment reference is missing');
         router.push('/');
         return;
      }
   }, [transRef, router]);

   const handleVerify = () => {
      if (!transRef) return;
      if (!access_token) return;

      verifyAcceptancePayment(
         { transRef, access_token: access_token },
         {
            onSuccess: (data) => {
               setVerificationResult(data);
            },
         }
      );
   };

   const handleRedirect = () => {
      router.push(`${baseUrl}/dashboard/history/student-payments/tuition`);
      router.refresh();
   }

   if (!transRef) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
               <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
               <p className="text-gray-600">Payment reference is required</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <PaymentVerificationCard
            paymentRef={transRef || ''}
            isVerifying={isPending}
            verificationResult={verificationResult}
            onVerify={handleVerify}
            onProceed={handleRedirect}
            autoVerify={false}
         />
      </div>
   )
}

export default VerifyAcceptance



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useToast } from "@/contexts/ToastContext";
// import { VerifyAcceptanceFeePayment } from "@/app/actions/student";
// import { baseUrl } from "@/config";
// import Loader from "@/components/application/Loader";;
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { formatToCurrency } from "@/lib/utils";

// const VerifyAcceptance = () => {
//    const searchParams = useSearchParams();

//    const transRef = searchParams.get('transRef');
//    const transAmount = searchParams.get('transAmount');
//    const currency = searchParams.get('currency');

//    const router = useRouter();
//    const [isLoading, setIsLoading] = useState(false);
//    const { showToast } = useToast();
//    const { access_token } = useAuth();

//    useEffect(() => {
//       async function verifyPayment(access: string, ref: string) {
//          setIsLoading(true);
//          const { error, success } = await VerifyAcceptanceFeePayment(access, ref);
//          if (success) {
//             setIsLoading(false);
//             showToast({
//                description: success.message,
//                variant: 'success',
//             }, 10000);
//             router.push(`${baseUrl}/dashboard/history/student-payments/tuition`);
//             router.refresh();
//          }
//          if (error) {
//             setIsLoading(false);
//             console.log('error', error);
//             showToast({
//                description: 'Something went wrong!',
//                variant: 'error',
//             }, 10000);
//          }
//       }
//       if (transRef && access_token) {
//          const ref = Array.isArray(transRef) ? transRef[0] : transRef;
//          verifyPayment(access_token, ref);
//       }
//    }, [transRef, access_token, router, showToast])

//    if (!transRef) {
//       return (
//          <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="text-center">
//                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
//                <p className="text-gray-600">Payment reference is required</p>
//             </div>
//          </div>
//       );
//    }

//    return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//          <Card className="w-full max-w-md mx-auto">
//             <CardHeader className="text-center">
//                <CardTitle>Payment Verification</CardTitle>
//                <CardDescription>
//                   Verifying your Acceptance fee payment to complete the process
//                </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                <div className="text-center">
//                   <p className="text-sm text-gray-600 mb-2">Payment Reference</p>
//                   <p className="font-mono text-lg font-semibold text-site-a-dark bg-gray-100 p-2 rounded">
//                      {transRef}
//                   </p>
//                </div>
//                <div className='flex flex-col items-center justify-center space-y-10'>
//                   {isLoading && <Loader />}
//                   {transRef &&
//                      (<div className='w-full space-y-5'>
//                         <div className="flex justify-between items-center">
//                            <div className='text-lg font-bold text-site-b-dark'>Transaction Amount</div>    <div>{transAmount && formatToCurrency(Number(transAmount))}</div>
//                         </div>
//                         <div className="flex justify-between items-center">
//                            <div className='text-lg font-bold text-site-b-dark'>Currency</div>              <div>{currency && currency}</div>
//                         </div>
//                      </div>)
//                   }
//                </div>
//             </CardContent>
//          </Card>
//       </div>
//    )
// }
// export default VerifyAcceptance;
// // http://localhost:3003/admission/payments/verify-tuition?transAmount=75000.00&reference=1429z865hD1752948845&transRef=m0FQ00V9vn14fqjz29sa&errorMessage=Approved+by+Financial+Institution&redirectOnError=0&currency=NGN&gateway=&channelId=0&status=0

// // https://pay.credodemo.com/v4/fsEt001mmK14tip5297P