import Confetti from 'react-confetti';
import React, {useState} from "react";
import DraftTicker from "./DraftTicker";
import DraftDrink from "./DraftDrink";
import field from "./images/field.png"
import football from "./images/football.png"
import styled, { keyframes } from "styled-components";
import { css } from 'styled-components';
import { randomTier, pick } from "./const";

const Background = styled.div`
  background-image: url(${field});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
`;

const dieAnimation = (offset) => keyframes`
   0% {
      
   } 50% {
      transform: translate(${offset/2}px, -120px) rotate(1440deg);
   }
   100% {
      transform: translate(${offset}px, 0px) rotate(2880deg);
   }
`;

const FootballImage = styled.img.attrs(props => ({animate: props.animate || false, offset: props.offset || 0}))`
  height: 50px;
  width: 50px;
  position: absolute;
  top: 45%;
  left: 10%;
  animation-duration: 1.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-name: ${props => props.animate ? css`${dieAnimation(props.offset)}` : ""};
`;


const App = () => {
  const [useConfetti, setUseConfetti] = useState(false);
  const [animateFootball, setAnimateFootball] = useState(false);
  const [offset, setOffset] = useState(false);
  const [foundTier, setFoundTier] = useState(1);
  const [tierIsFound, setTierIsFound] = useState(false);

  const onFootballClick = () => {
    const tier = randomTier(pick);
    const tierPix = [1000, 700, 400];
    setFoundTier(tier);
    setOffset(tierPix[tier-1]);
    setAnimateFootball(true);
    setTimeout(function(){
      setTierIsFound(true);
    }, 2000);
  }
  return (
    <Background>
      <DraftTicker onDraftClick={() => {setAnimateFootball(false); setUseConfetti(false); setTierIsFound(false);}} />
      <FootballImage src={football} onClick={onFootballClick} animate={animateFootball} offset={offset}/>
      {tierIsFound && <DraftDrink tier={foundTier} setUseConfetti={setUseConfetti} />}
      {useConfetti && 
        <div style={{width: "100%", height: "100%"}}>
          <Confetti
            numberOfPieces={100}
            gravity={0.3}
            drawShape={ctx => {
              ctx.beginPath();
              ctx.scale(1, 0.5);
              ctx.arc(15, 15, 20, 0, 2 * Math.PI);
              ctx.stroke();
              ctx.fill();
              ctx.closePath();
              ctx.scale(1, 1);
              ctx.fillStyle = 'white';
              ctx.fillRect(5, 12.5, 20, 5);
              ctx.fillRect(7.5, 10, 2, 10);
              ctx.fillRect(12.5, 10, 2, 10);
              ctx.fillRect(17.5, 10, 2, 10);
              ctx.fillRect(22.5, 10, 2, 10);
            }}
          />
        </div>
      }
    </Background>
  );
}

export default App;
