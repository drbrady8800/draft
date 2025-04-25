'use client';
import { DraftPick } from "@/lib/types";
import DraftTickerBox from "@/components/DraftTickerBox";

interface DraftTickerProps {
  draftPicks: DraftPick[];
  currentPick: number | null;
  loading?: boolean;
}

const DraftTicker: React.FC<DraftTickerProps> = ({ currentPick, draftPicks, loading = false }) => {
  const sortedPicks = [...draftPicks].sort((a, b) => a.draft_order - b.draft_order);
  
  if (loading) {
    return (
      <div className='flex justify-center w-full'>
        <div className='flex w-[90vw] p-6 gap-4 rounded-lg bg-black/50 overflow-x-auto'>
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="h-24 min-w-32 rounded-lg bg-gray-700/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className='flex justify-center w-full'>
      <div className='flex w-[90vw] p-6 gap-4 rounded-lg bg-black/50 overflow-x-auto'>
        {sortedPicks.map((pick) => {
          return (
            <DraftTickerBox
              key={pick.id}
              name={pick?.person_name || 'Unknown'}
              pick={pick.draft_order}
              primaryColor={pick?.team_primary_color || '#000000'}
              secondaryColor={pick?.team_secondary_color || '#FFFFFF'}
              playerImage={pick?.player_image}
              playerName={pick?.player_name}
              playerType={pick?.player_type}
              isCurrentPick={pick.draft_order === currentPick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DraftTicker;
