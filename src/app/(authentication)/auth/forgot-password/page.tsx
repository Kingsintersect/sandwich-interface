"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ArrowLeft01Icon,
    CheckmarkCircle02Icon,
    Loading03Icon,
    Mail01Icon,
} from "@hugeicons/core-free-icons";
import AuthShell from "../component/AuthShell";
import { InputFormField } from "@/components/ui/inputs/FormFields";
import { Icon } from "@/components/ui/icon";

const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Enter the email address on your application")
        .email("Enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        setFailed(false);
        try {
            // INTEGRATION POINT: the backend has no password-reset endpoint yet.
            // Swap this for the real call (e.g. a requestPasswordReset server
            // action) once it exists - the success and failure states below are
            // already wired up for it.
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            setSentTo(data.email);
        } catch {
            setFailed(true);
        }
    };

    if (sentTo) {
        return (
            <AuthShell
                title="Check your inbox"
                subtitle={`If an account exists for ${sentTo}, we've sent a link to reset your password. The link expires in one hour.`}
            >
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                        <Icon icon={CheckmarkCircle02Icon} className="size-5.5" />
                    </span>
                    <h2 className="mt-5 font-semibold text-ocean-900 dark:text-foreground">
                        Nothing arrived?
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Check your spam folder first. If it still hasn&apos;t come
                        through, contact the registry at{" "}
                        <a
                            href="mailto:sandwich@unizik.edu.ng"
                            className="font-medium text-ocean-600 underline-offset-4 hover:underline dark:text-ocean-300"
                        >
                            sandwich@unizik.edu.ng
                        </a>
                        .
                    </p>

                    <button
                        type="button"
                        onClick={() => setSentTo(null)}
                        className="mt-5 text-sm font-semibold text-ember-600 underline-offset-4 transition-colors hover:underline"
                    >
                        Use a different address
                    </button>
                </div>

                <Link
                    href="/auth/signin"
                    className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-600 transition-colors hover:text-ember-600 dark:text-ocean-300"
                >
                    <Icon
                        icon={ArrowLeft01Icon}
                        className="size-4 transition-transform group-hover:-translate-x-0.5"
                    />
                    Back to sign in
                </Link>
            </AuthShell>
        );
    }

    return (
        <AuthShell
            title="Reset your password"
            subtitle="Enter the email address you applied with and we'll send you a link to set a new password."
            footer={
                <span>
                    Remembered it?{" "}
                    <Link
                        href="/auth/signin"
                        className="font-semibold text-ocean-600 underline-offset-4 transition-colors hover:text-ember-600 hover:underline dark:text-ocean-300"
                    >
                        Back to sign in
                    </Link>
                </span>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="block w-full space-y-7 text-left">
                <InputFormField<ForgotPasswordFormData>
                    type="text"
                    id="email"
                    label="Email address"
                    name="email"
                    register={register}
                    error={errors.email}
                />

                {failed && (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        We couldn&apos;t send the reset link just now. Please try
                        again, or contact the registry if it keeps failing.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ember-surface flex h-12 w-full items-center justify-center gap-2.5 rounded-full text-sm font-semibold text-white shadow-ember transition-all hover:bg-none hover:bg-ember-700 disabled:cursor-not-allowed disabled:bg-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                >
                    {isSubmitting ? (
                        <>
                            Sending link
                            <Icon icon={Loading03Icon} className="size-4.5 animate-spin" />
                        </>
                    ) : (
                        <>
                            Send reset link
                            <Icon icon={Mail01Icon} className="size-4.5" />
                        </>
                    )}
                </button>
            </form>
        </AuthShell>
    );
}
