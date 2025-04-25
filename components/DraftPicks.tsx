'use client';

import React, { useState, MouseEvent } from "react";
import { DraftablePlayer } from "@/lib/types";
import DraftablePlayerBox from "@/components/DraftablePlayerBox";

interface DraftPicksProps {
  onPlayerSelected: (player: DraftablePlayer) => void;
  availablePlayers: DraftablePlayer[];
  onClearSelection: () => void;
}

const DraftPicks: React.FC<DraftPicksProps> = ({ onPlayerSelected, availablePlayers, onClearSelection }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<DraftablePlayer | null>(null);

  const handleSelection = (e: MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLDivElement;
    const playerIndex = parseInt(target.dataset.index || '0');
    const player = availablePlayers[playerIndex];

    if (player) {
      setSelectedPlayer(player);
      onPlayerSelected(player);
    }
  };

  const handleClearSelection = async () => {
    setSelectedPlayer(null);
    onClearSelection();
  };

  if (availablePlayers.length === 0) {
    return;
  }
  
  return (
    <div className='w-full flex justify-center'>
      <div className={`relative mt-12 max-w-6xl flex ${selectedPlayer ? "justify-center" : " w-[90vw]"} gap-4 p-6 overflow-x-auto bg-black/50 text-white text-6xl text-center rounded-lg`}>
        {selectedPlayer ? (
          <div className="relative">
            {selectedPlayer?.name || "No player selected"}
            <button
              onClick={handleClearSelection}
              className="absolute -top-4 -right-4 w-4 h-4 text-white text-3xl rounded-full flex items-center justify-center cursor-pointer hover:text-gray-400 transition-all duration-300"
            >
              ×
            </button>
          </div>
        ) : (
          availablePlayers.map((player, index) => (
            <DraftablePlayerBox 
              key={player.id}
              player={player}
              onClick={handleSelection}
              data-index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DraftPicks;
