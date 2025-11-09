
import React from 'react';

interface SpinnerProps {
    message?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col justify-center items-center z-50">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            {message && <p className="text-white text-lg mt-4">{message}</p>}
        </div>
    );
};
