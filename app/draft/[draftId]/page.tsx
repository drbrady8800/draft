'use client';

import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import DraftTicker from '@/components/DraftTicker';
import DraftPicks from '@/components/DraftPicks';
import DraftButton from '@/components/DraftButton';
import FootballField from '@/components/FootballField';
import { useDraftPicks, api } from '@/hooks/useApi';
import { DraftablePlayer } from '@/lib/types';

// Dynamically import Confetti with no SSR to avoid hydration issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function DraftPage({ params }: { params: Promise<{ draftId: number }> }) {
  const { draftId } = use(params);
  const [useConfetti, setUseConfetti] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [windowHeight, setWindowHeight] = useState<number | undefined>(undefined);
  const [currentPick, setCurrentPick] = useState<number | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<DraftablePlayer[]>([]);
  const [isDraftButtonDisabled, setIsDraftButtonDisabled] = useState<boolean>(false);
  
  // Use the hooks instead of local state and fetch calls
  const { draftPicks, isLoading, mutate: mutateDraftPicks } = useDraftPicks(draftId.toString());

  // Set window dimensions after the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Update current pick when draft picks change
  useEffect(() => {
    if (draftPicks) {
      const nextPick = draftPicks.find(pick => !pick.drafted_player_id);
      if (nextPick) {
        setCurrentPick(nextPick.draft_order);
      } else {
        setCurrentPick(null);
      }
    }
  }, [draftPicks]);

  const handleDraftClick = async (): Promise<void> => {
    try {
      const players = await api.getAvailablePlayers(draftId.toString());
      setAvailablePlayers(players);
      setUseConfetti(false);
      setIsDraftButtonDisabled(true);
    } catch (error) {
      console.error('Error fetching available players:', error);
    }
  };

  const handleClearSelection = () => {
    setIsDraftButtonDisabled(false);
    setAvailablePlayers([]);
  };

  const handlePlayerSelected = async (player: DraftablePlayer) => {
    try {
      // Find the current pick
      const currentPick = draftPicks?.find(pick => !pick.drafted_player_id);
      if (!currentPick) return;

      // Update the draft pick with the selected player
      await api.updateDraftPick(currentPick.id.toString(), {
        ...currentPick,
        drafted_player_id: player.id
      });

      // Mutate the draft picks to refresh the data
      await mutateDraftPicks();
    } catch (error) {
      console.error('Error updating draft pick:', error);
    }
  };

  return (
    <div className='min-h-screen min-w-screen flex flex-col items-center justify-center'>
      <FootballField />
      <div className='absolute top-0 left-0 text-center text-lg text-white p-5 min-h-full min-w-full flex flex-col items-center justify-start bg-black/30 backdrop-blur-[3px]'>
        <div className='w-full max-w-6xl'>
          <DraftButton onClick={handleDraftClick} disabled={isDraftButtonDisabled}/>
          <DraftTicker currentPick={currentPick} draftPicks={draftPicks || []} loading={isLoading} />
          
          {currentPick && (
            <DraftPicks
              onPlayerSelected={handlePlayerSelected}
              availablePlayers={availablePlayers}
              onClearSelection={handleClearSelection}
            />
          )}
        </div>
      </div>
      {useConfetti && windowWidth && windowHeight && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}
    </div>
  );
}
