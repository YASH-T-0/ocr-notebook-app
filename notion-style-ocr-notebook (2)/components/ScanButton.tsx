import React from 'react';
import { CameraIcon } from './icons';

interface ScanButtonProps {
    onClick: () => void;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-20 flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            aria-label="Scan new note"
        >
            <CameraIcon />
        </button>
    );
};
