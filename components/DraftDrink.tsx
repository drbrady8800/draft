'use client';

import React, { useState, MouseEvent } from "react";
import { PICKS_LEFT } from "@/lib/constants";

interface DrinkBoxProps {
  image: string;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

const DrinkBox: React.FC<DrinkBoxProps> = ({ image, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="h-52 min-w-36 bg-center bg-cover bg-no-repeat rounded-lg flex flex-col p-2.5 justify-center transition-all duration-300 cursor-pointer hover:translate-y-[-5px] hover:scale-102"
      style={{ backgroundImage: `url(${image})` }}
    />
  );
};

interface DraftDrinkProps {
  tier: number;
  setUseConfetti: (value: boolean) => void;
}

const DraftDrink: React.FC<DraftDrinkProps> = (props) => {
  const [draftBoxes, setDraftBoxes] = useState<React.ReactNode[]>([]);
  const [draftBoxesIntialized, setDraftBoxesIntialized] = useState<boolean>(false);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [drink, setDrink] = useState<string>("");

  const handleSelection = (e: MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLDivElement;
    const firstChild = target.firstChild as HTMLElement;

    console.log("HELLO")
    setDrink("HELLO");
    setShowBoxes(false);
    props.setUseConfetti(true);
    
    if (firstChild && firstChild.firstChild) {
      let position = (firstChild.firstChild as HTMLElement).textContent || "";
      
      for (let i = 0; i < PICKS_LEFT[props.tier-1].length; i++) {
        if (position === PICKS_LEFT[props.tier-1][i].name) {
          setDrink(PICKS_LEFT[props.tier-1][i].beer);
          PICKS_LEFT[props.tier-1].splice(i, 1);
          break;
        }
      }
  
      setShowBoxes(false);
      props.setUseConfetti(true);
    }
  };

  if (!draftBoxesIntialized) {
    PICKS_LEFT[props.tier-1].forEach((pick) => {
      draftBoxes.push(
        <DrinkBox 
          key={pick.name}
          image={pick.picture}
          onClick={handleSelection}
        />
      );
    });
    setDraftBoxesIntialized(true);
  }
  
  return (
    <div className='w-full flex justify-center'>
      <div className={`relative mt-12 max-w-6xl flex ${showBoxes ? "w-[90vw]" : "justify-center"} gap-4 p-6 overflow-x-auto bg-black/50 text-white text-6xl text-center rounded-lg`}>
        {showBoxes ? draftBoxes : drink}
      </div>
    </div>
  );
};

export default DraftDrink;
