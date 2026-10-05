import React, { ReactNode } from 'react'

const PageWrapper = ({ children }: { children: ReactNode }) => {
   return (
      <div className='flex flex-1 flex-col gap-4 px-4 pb-10 pt-2 sm:px-6 lg:px-8'>
         {children}
      </div>
   )
}

export default PageWrapper
