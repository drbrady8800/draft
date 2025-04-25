'use client';

import { MouseEvent } from 'react';
import { DraftablePlayer } from '@/lib/types';

interface DraftablePlayerBoxProps {
  player: DraftablePlayer;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

const DraftablePlayerBox: React.FC<DraftablePlayerBoxProps> = ({ player, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="h-52 min-w-36 bg-center bg-cover bg-no-repeat rounded-lg flex flex-col p-2.5 justify-center transition-all duration-300 cursor-pointer hover:translate-y-[-5px] hover:scale-102"
      style={{ backgroundImage: `url(${player.image_url})` }}
    />
  );
};

export default DraftablePlayerBox;

