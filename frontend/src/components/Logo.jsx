import React from 'react';

const Logo = ({ w = 120, h = 40, showText = true, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/grren png.png" 
        alt="Adoor Real Estate Logo"
        width={h}
        height={h}
        className="object-contain rounded"
      />
      {showText && (
        <div className='text-xl font-bold text-gray-800'>
          Adoor Real Estate
        </div>
      )}
    </div>
  );
};

export default Logo;