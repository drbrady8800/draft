import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DraftablePlayer, DraftablePlayerType } from '@/lib/types';

interface FootballAnimationProps {
  availablePlayers: DraftablePlayer[];
  onAnimationComplete: () => void;
  hasAnimated: boolean;
}

const FootballAnimation: React.FC<FootballAnimationProps> = ({ 
  availablePlayers, 
  onAnimationComplete,
  hasAnimated
}) => {
  const [distance, setDistance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const playerType = availablePlayers.length > 0 ? availablePlayers[0]?.type : 'good';
  
  // Determine animation distance based on player type
  const getAnimationDistance = () => {
    // Good players: Far distance
    if (playerType === 'good') return 60;
    // Mid players: Medium distance
    if (playerType === 'mid') return 40;
    // Bad players: Short distance
    return 20;
  };
  
  useEffect(() => {
    if (availablePlayers.length > 0 && !hasAnimated) {
      setDistance(getAnimationDistance());
      setIsAnimating(true);
      
      // Set a timeout to complete the animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete();
      }, 2000); // Animation duration
      
      return () => clearTimeout(timer);
    } else if (availablePlayers.length === 0) {
      // Reset the football position when selection is cleared
      setDistance(0);
      setIsAnimating(false);
    }
  }, [availablePlayers, onAnimationComplete, hasAnimated]);
  
  return (
    <div 
      className={`absolute top-1/2 left-1/6 -translate-y-1/2 ${isAnimating ? `animate-arc-${playerType}` : ''}`}
      style={{
        transform: `translateX(${distance}vw)`,
        transition: 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <Image 
        src="/images/football.png" 
        alt="Football" 
        width={60} 
        height={40}
        className={'object-contain'}
      />
    </div>
  );
};

export default FootballAnimation; 

