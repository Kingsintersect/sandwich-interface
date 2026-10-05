import React, { ReactNode } from 'react'
import AuthShell from './AuthShell';

interface AuthPageTemplateProps {
   title: string,
   children: ReactNode;
   params?: { slug: string },
   searchParams?: { [key: string]: string },
   subTitle?: string;
   footer?: ReactNode;
}

/**
 * Kept as the entry point the auth pages already import; the layout itself now
 * lives in AuthShell, which renders no site header.
 */
const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({ title, subTitle, children, footer }) => {
   return (
      <AuthShell title={title} subtitle={subTitle} footer={footer}>
         {children}
      </AuthShell>
   )
}

export default AuthPageTemplate
