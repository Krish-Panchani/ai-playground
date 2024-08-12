// SkeletonLoader.js
import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 border-2 border-gray-700 rounded-2xl animate-pulse">
                    <div className="w-full h-6 bg-gray-700 rounded-md mb-2"></div>
                    <div className="w-full h-48 bg-gray-700 rounded-md mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-700 rounded-md"></div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
