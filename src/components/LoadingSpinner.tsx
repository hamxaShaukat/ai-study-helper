import React from 'react';

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 8 }) => {
    const sizeClass = `h-${size} w-${size}`;
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`animate-spin rounded-full ${sizeClass} border-2 border-gray-300 border-t-black`}></div>
            {/* <p className="text-gray-500 text-sm">Generating content...</p> */}
        </div>
    );
};

export default LoadingSpinner;