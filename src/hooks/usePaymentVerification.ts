import { PaymentService } from '@/app/(application)/admission/payments/verify-admission/payment.service';
import { PaymentVerificationRequest } from '@/schemas/payment.schema';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePaymentVerification = () => {
    return useMutation({
        mutationFn: (data: PaymentVerificationRequest) => PaymentService.verifyPayment(data),
        onSuccess: (data) => {
            if (data.status.toLowerCase() === ('Successful').toLowerCase()) {
                toast.success('Payment verified successfully');
            } else {
                console.error('Payment verification failed:', data.message);
                toast.error(data.message || 'Payment verification failed');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Payment verification failed');
        },
    });
};

export const useAcceptanceVerification = () => {
    return useMutation({
        mutationFn: (data: PaymentVerificationRequest) => PaymentService.verifyAcceptancePayment(data),
        onSuccess: (data) => {
            if (data.status.toLowerCase() === ('Successful').toLowerCase()) {
                toast.success('Payment verified successfully');
            } else {
                console.error('Payment verification failed:', data.message);
                toast.error(data.message || 'Payment verification failed');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Payment verification failed');
        },
    });
};

export const useTuitionVerification = () => {
    return useMutation({
        mutationFn: (data: PaymentVerificationRequest) => PaymentService.verifyTuitionPayment(data),
        onSuccess: (data) => {
            if (data.status.toLowerCase() === ('Successful').toLowerCase()) {
                toast.success('Payment verified successfully');
            } else {
                console.error('Payment verification failed:', data.message);
                toast.error(data.message || 'Payment verification failed');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Payment verification failed');
        },
    });
};

export const useReturnFeeVerification = () => {
    return useMutation({
        mutationFn: (data: PaymentVerificationRequest) => PaymentService.verifyReturnFeePayment(data),
        onSuccess: (data) => {
            if (data.status.toLowerCase() === ('Successful').toLowerCase()) {
                toast.success('Returning fee verified successfully');
            } else {
                console.error('Returning fee verification failed:', data.message);
                toast.error(data.message || 'Returning fee verification failed');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Returning fee verification failed');
        },
    });
};
