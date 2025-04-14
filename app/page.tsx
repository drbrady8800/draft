'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DraftTicker from '@/components/DraftTicker';
import DraftDrink from '@/components/DraftDrink';
import DraftButton from '@/components/DraftButton';
import FootballField from '@/components/FootballField';
import { randomTier } from '@/lib/constants';

// Dynamically import Confetti with no SSR to avoid hydration issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function Home() {
  const [currentTier, setCurrentTier] = useState<number | null>(null);
  const [useConfetti, setUseConfetti] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [windowHeight, setWindowHeight] = useState<number | undefined>(undefined);

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

  const handleDraftClick = (): void => {
    const tier = randomTier(0);
    setCurrentTier(tier);
    setUseConfetti(false);
  };

  return (
    <FootballField>
      <div className='text-center text-lg text-white p-5 min-h-full min-w-full flex flex-col items-center justify-start bg-black/30 backdrop-blur-[3px]'>
        <div className='w-full max-w-6xl'>
          {useConfetti && windowWidth && windowHeight && (
            <Confetti
              width={windowWidth}
              height={windowHeight}
              recycle={false}
              numberOfPieces={500}
            />
          )}
          
          <DraftButton onClick={handleDraftClick}/>
          <DraftTicker />
          
          {currentTier && (
            <DraftDrink 
              tier={currentTier} 
              setUseConfetti={setUseConfetti} 
            />
          )}
        </div>
      </div>
    </FootballField>
  );
}
