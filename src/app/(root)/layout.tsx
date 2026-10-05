import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        // The header floats over the hero, so the page starts flush at the top.
        <div className='root flex min-h-screen flex-col bg-background'>
            <Header />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout
