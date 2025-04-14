'use client';

import React from "react";
import Image from "next/image";

interface DraftButtonProps {
  onClick: () => void;
}

const DraftButton: React.FC<DraftButtonProps> = ({ onClick }) => {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer'>
      <Image
        src='/images/draft.png'
        width={125}
        height={125}
        alt='Draft logo'
        onClick={onClick}
      />
    </div>
  );
};

export default DraftButton;
