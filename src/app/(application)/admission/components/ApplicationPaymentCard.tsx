import { Button } from '@/components/ui/button';
import { APPLICATION_FEE, credoPaymentBaseUrl } from '@/config';
import { formatToCurrency } from '@/lib/utils';
import { ArrowRight, CreditCard, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

export const ApplicationPaymentCard = ({ user }) => {
    const router = useRouter();

    const handlePayApplicationFee = () => {
        const paymentUrl = `${credoPaymentBaseUrl}/${user?.reference}`;
        router.push(paymentUrl);
    };
    return (
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ready to Begin Your Application</h3>
                <p className="text-gray-600">Your account has been created successfully. Let's start your admission process.</p>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-center">
                <h4 className="text-xl font-semibold text-white mb-2">Start Your Application Process</h4>
                <p className="text-blue-100 mb-6">Pay the application fee to unlock the admission form and begin your journey with us.</p>

                <Button
                    onClick={handlePayApplicationFee}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center shadow-lg"
                >
                    <CreditCard className="h-5 w-5 mr-3" />
                    Pay Application Fee - <span className="text-red-400">{formatToCurrency(APPLICATION_FEE)}</span>
                    <ArrowRight className="h-5 w-5 ml-3" />
                </Button>

                <p className="text-blue-100 text-sm mt-3">
                    Secure payment • Multiple payment options available
                </p>
            </div>
        </div>
    )
}
