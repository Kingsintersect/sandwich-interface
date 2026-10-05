'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import AuthPageTemplate from '../component/AuthPageTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Loading03Icon, Login03Icon } from '@hugeicons/core-free-icons';
import { SigninSchema } from './signin.types';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { InputFormField } from '@/components/ui/inputs/FormFields';
import { Icon } from '@/components/ui/icon';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type SigninFormData = z.infer<typeof SigninSchema>;

export default function AuthPage() {
    const searchParams = useSearchParams();
    const referenceNumber = searchParams.get('email') || '';
    const { initializeLogin, loading } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isValid },
    } = useForm<SigninFormData>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            reference: referenceNumber || undefined,
            password: ''
        }
    });

    useEffect(() => {
        if (referenceNumber) {
            // If reference number is present, set it in the form
            setValue('reference', referenceNumber);
        }
    }, [referenceNumber, setValue]);

    const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
        await initializeLogin(data);
    };

    const busy = isSubmitting;

    return (
        <AuthPageTemplate
            title={'Welcome back'}
            subTitle={'Sign in to continue your application, register courses or check your results.'}
            footer={
                <span>
                    New to the Sandwich Programme?{' '}
                    <Link
                        href="/auth/signup"
                        className="font-semibold text-ocean-600 underline-offset-4 transition-colors hover:text-ember-600 hover:underline dark:text-ocean-300"
                    >
                        Apply for admission
                    </Link>
                </span>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className={cn(`block w-full space-y-7 text-left`)}>
                <div className="grid grid-cols-1 gap-7">
                    <InputFormField<SigninFormData>
                        type="text"
                        id={'reference'}
                        label="Email or registration number"
                        name="reference"
                        register={register}
                        error={errors.reference}
                    />
                    <InputFormField<SigninFormData>
                        type="password"
                        id={'password'}
                        label="Password"
                        name="password"
                        register={register}
                        error={errors.password}
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="remember" className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                        <input
                            id="remember"
                            type="checkbox"
                            className="size-4 rounded border-border text-ocean-600 accent-ocean-600 focus:ring-2 focus:ring-ocean-500/40"
                        />
                        Remember me
                    </label>

                    <Link
                        href={"/auth/forgot-password"}
                        className="text-sm font-medium text-ember-600 underline-offset-4 transition-colors hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="ember-surface flex h-12 w-full items-center justify-center gap-2.5 rounded-full text-sm font-semibold text-white shadow-ember transition-all hover:bg-none hover:bg-ember-700 disabled:cursor-not-allowed disabled:bg-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                >
                    {busy ? (
                        <>
                            Signing you in
                            <Icon icon={Loading03Icon} className="size-4.5 animate-spin" />
                        </>
                    ) : (
                        <>
                            Sign in
                            <Icon icon={Login03Icon} className="size-4.5" />
                        </>
                    )}
                </button>
            </form>
        </AuthPageTemplate>
    );
}
