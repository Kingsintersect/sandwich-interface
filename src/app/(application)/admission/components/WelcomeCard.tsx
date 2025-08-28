import React from 'react'

export const WelcomeCard = ({ user }) => {
    return (
        <div className="text-center mb-12" >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Admission Journey!</h2>
            <p className="text-xl text-gray-600 mb-2">Hello <span className="text-green-600 font-bold">{user?.first_name}</span>, you're just a few steps away from joining our program.</p>
            {/* <p className="text-gray-500">Follow the simple process below to complete your admission application.</p> */}
        </div>
    )
}
