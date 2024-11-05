import React, { ReactNode } from 'react';

interface CustomContainerProps {
  children: ReactNode;
}

const CustomContainer: React.FC<CustomContainerProps> = ({ children }) => {
  return (
    <div className='max-w-[1160px] mx-auto px-4 sm:px-9'>
      {children}
    </div>
  );
}

export default CustomContainer;