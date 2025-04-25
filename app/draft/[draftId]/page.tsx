'use client';

import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import DraftTicker from '@/components/DraftTicker';
import DraftPicks from '@/components/DraftPicks';
import DraftButton from '@/components/DraftButton';
import FootballField from '@/components/FootballField';
import { DraftablePlayer, DraftPick } from '@/lib/types';

// Dynamically import Confetti with no SSR to avoid hydration issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function DraftPage({ params }: { params: Promise<{ draftId: number }> }) {
  const { draftId } = use(params);
  const [useConfetti, setUseConfetti] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [windowHeight, setWindowHeight] = useState<number | undefined>(undefined);
  const [currentPick, setCurrentPick] = useState<number | null>(null);
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<DraftablePlayer[]>([]);
  const [isDraftButtonDisabled, setIsDraftButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Fetch current draft and picks
  useEffect(() => {
    const fetchDraftData = async () => {
      setLoading(true);
      try {
        // Fetch draft picks for the current draft
        const picksResponse = await fetch(`/api/draft-picks?draftId=${draftId}`);
        const picksData = await picksResponse.json();
        setDraftPicks(picksData);

        // Find the current pick (first undrafted pick)
        const currentPick = picksData.find((pick: DraftPick) => !pick.drafted_player_id);
        if (currentPick) {
          setCurrentPick(currentPick.draft_order);
        }
      } catch (error) {
        console.error('Error fetching draft data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDraftData();
  }, [draftId]);

  const handleDraftClick = async (): Promise<void> => {
    setLoading(true);
    const getAvailablePlayers = async (): Promise<DraftablePlayer[]> => {
      const response = await fetch(
        `/api/players/available?draftId=${draftId}`
      );
      return response.json();
    };
    
    try {
      const players = await getAvailablePlayers();
      setAvailablePlayers(players);
      setUseConfetti(false);
      setIsDraftButtonDisabled(true);
    } catch (error) {
      console.error('Error fetching available players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSelection = () => {
    setIsDraftButtonDisabled(false);
    setAvailablePlayers([]);

    // Find the next undrafted pick
    const nextPick = draftPicks.find(pick => !pick.drafted_player_id);
    if (nextPick) {
      setCurrentPick(nextPick.draft_order);
    } else {
      // Draft is complete
      setCurrentPick(null);
    }
  };

  const handlePlayerSelected = async (player: DraftablePlayer) => {
    setLoading(true);
    try {
      // Find the current pick
      const currentPick = draftPicks.find(pick => !pick.drafted_player_id);
      if (!currentPick) return;

      // Update the draft pick with the selected player
      const response = await fetch(`/api/draft-picks/${currentPick.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentPick,
          drafted_player_id: player.id
        }),
      });

      if (!response.ok) throw new Error('Failed to update draft pick');

      // Update local state
      const updatedPick = await response.json();
      const updatedDraftPicks = draftPicks.map(pick => 
        pick.id === updatedPick.id ? updatedPick : pick
      );
      setDraftPicks(updatedDraftPicks);
    } catch (error) {
      console.error('Error updating draft pick:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen min-w-screen flex flex-col items-center justify-center'>
      <FootballField />
      <div className='absolute top-0 left-0 text-center text-lg text-white p-5 min-h-full min-w-full flex flex-col items-center justify-start bg-black/30 backdrop-blur-[3px]'>
        <div className='w-full max-w-6xl'>
          <DraftButton onClick={handleDraftClick} disabled={isDraftButtonDisabled}/>
          <DraftTicker currentPick={currentPick} draftPicks={draftPicks} loading={loading} />
          
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
