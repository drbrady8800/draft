'use client';

import React from "react";
import Image from "next/image";

interface DraftButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DraftButton: React.FC<DraftButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <div 
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125'
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <Image
        src='/images/draft.png'
        width={125}
        height={125}
        alt='Draft logo'
      />
    </div>
  );
};

export default DraftButton;
