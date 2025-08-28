import React from 'react'

export const FormErrorList = ({ allErrors }) => {
    return (
        <>
            {allErrors.length > 0 && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
                    <ul>
                        {allErrors.map((msg, idx) => (
                            <li key={idx}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}
