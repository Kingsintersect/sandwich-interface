import { SITE_NAME } from '@/config';
import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import React, { ReactNode } from 'react'
import AuthShell from '../component/AuthShell';

export const metadata: Metadata = {
   title: `${SITE_NAME} - Purchase Admission Form`,
   description: "Purchase your admission form to apply for admission into the university.",
};

type LayoutProps = {
   children: ReactNode
}

const Layout: NextPage<LayoutProps> = ({ children }: LayoutProps) => {
   return (
      <AuthShell
         wide
         title="Apply for admission"
         subtitle="Create your account and complete the application in three steps. Your progress is saved as you go - you only pay when you submit."
         footer={
            <span>
               Already have an account?{" "}
               <Link
                  href="/auth/signin"
                  className="font-semibold text-ocean-600 underline-offset-4 transition-colors hover:text-ember-600 hover:underline dark:text-ocean-300"
               >
                  Sign in instead
               </Link>
            </span>
         }
      >
         {children}
      </AuthShell>
   )
}

export default Layout
