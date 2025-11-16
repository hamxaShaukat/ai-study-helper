
import React from 'react';

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 8 }) => {
    const sizeClass = `h-${size} w-${size}`;
    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin rounded-full ${sizeClass} border-b-2 border-t-2 border-sky-400`}></div>
        </div>
    );
};

export default LoadingSpinner;
