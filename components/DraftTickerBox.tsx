'use client';
import { DraftablePlayerType } from "@/lib/types";
import { Popover } from "@mui/material";
import { useState } from "react";

interface DraftTickerBoxProps {
  name: string;
  pick: number;
  primaryColor: string;
  secondaryColor: string;
  playerImage?: string;
  playerName?: string;
  playerType?: DraftablePlayerType;
  isCurrentPick?: boolean;
}

const DraftTickerBox: React.FC<DraftTickerBoxProps> = ({
  name,
  pick,
  primaryColor,
  secondaryColor,
  playerImage,
  playerName,
  playerType,
  isCurrentPick
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div 
      className={`h-28 min-w-32 rounded-lg flex flex-col justify-bottom px-2 py-4 relative ${
        isCurrentPick ? 'animate-pulse-grow' : ''
      }`} 
      style={{ backgroundColor: primaryColor }}
    >
      <div className='text-center text-2xl/[24px] text-ellipsis' style={{ color: secondaryColor }}>
        {name}
      </div>
      <div className='text-center text-4xl' style={{ color: secondaryColor }}>
        {pick}
      </div>
      {playerImage && playerName && playerType && (
        <>
          <div 
            className='absolute -bottom-2 -right-2 w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer' 
            style={{ borderColor: secondaryColor }}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <img 
              src={playerImage} 
              alt={playerName}
              className='w-full h-full object-cover'
            />
          </div>
          <Popover
            sx={{
              pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <div className={`px-3 py-1 text-sm text-white bg-${playerType}`}>
              {playerName}
            </div>
          </Popover>
        </>
      )}
    </div>
  );
};

export default DraftTickerBox;
