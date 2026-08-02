import React from 'react';

const Logo = ({ w = 120, h = 40, showText = true, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/grren png.png" 
        alt="Adoo Real Estate Logo"
        width={h}
        height={h}
        className="object-contain rounded"
      />
      {showText && (
        <div className='hidden sm:block leading-none text-[#121f2f]'>
          <span className='block text-xl font-extrabold tracking-[0.08em]'>ADOOR</span>
          <span className='block text-[8px] tracking-[0.25em] mt-1'>REAL ESTATE</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
