'use client';

import React, { useState } from "react";
import { draftOrder, Player } from "@/lib/constants";

interface DraftBoxProps {
  name: string;
  pick: number;
  color: string;
}

const DraftBox: React.FC<DraftBoxProps> = ({ name, pick, color }) => {
  return (
    <div className='text-white h-24 min-w-24 rounded-lg flex flex-col p-2' style={{ backgroundColor: color }}>
      <div className='text-center text-2xl'>
        {name}
      </div>
      <div className='text-center text-4xl'>
        {pick}
      </div>
    </div>
  );
};

const DraftTicker: React.FC = () => {
  const [draftBoxes, setDraftBoxes] = useState<React.ReactNode[]>([]);
  const [draftBoxesIntialized, setDraftBoxesIntialized] = useState<boolean>(false);
  
  const removeFirstBox = (): void => {
    setDraftBoxes(draftBoxes.slice(1, draftBoxes.length));
  };
  
  if (!draftBoxesIntialized) {
    draftOrder.forEach((player: Player, i: number) => 
      draftBoxes.push(
        <DraftBox 
          key={i}
          name={player.name} 
          pick={i+1} 
          color={player.color}
        />
      )
    );
    setDraftBoxesIntialized(true);
  }
  
  return (
    <div className='flex justify-center w-full'>
      <div className='flex w-[90vw] p-6 gap-4 rounded-lg bg-black/50 overflow-x-auto'>
        {draftBoxes}
      </div>
    </div>
  );
};

export default DraftTicker;
