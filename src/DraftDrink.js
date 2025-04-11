import React, {useState} from "react";
import styled from "styled-components";
import {PICKS_LEFT} from "./const"

const DrinkBoxWrapper = styled.div.attrs(props => ({image: props.image}))`
  background-image: url(${props => props.image});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 200px;
  min-width: 150px;
  color: black;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: center;
`;

const PickName = styled.div`
  text-align: center;
  font-size: 0px;
`;

const DrinkTickerWrapper = styled.div`
  position: absolute;
  top: 200px;
  width: calc(100vw - 40px);
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow: hidden;
  padding: 20px;
  justify-content: space-around;
`;

const DrinkNameWrapper = styled.div`
  position: absolute;
  top: 400px;
  left: 44.5%;
  color: black;
  background-color: white;
  border-radius: 8px;
  font-size: 40px;
  padding: 20px;
  justify-content: space-around;
`;


const DrinkBox = (props) => {
  return (
    <DrinkBoxWrapper onClick={props.onClick} image={props.image}>
      <PickName>
        {props.name}
      </PickName>
    </DrinkBoxWrapper>
  )
}


const DraftDrink = (props) => {
  const [draftBoxes, setDraftBoxes] = useState([]);
  const [draftBoxesIntialized, setDraftBoxesIntialized] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [drink, setDrink] = useState("");

  const handleSelection = (e) => {
    let position = e.target.firstChild.firstChild.data;
    console.log(props.tier);
    for (let i = 0; i < PICKS_LEFT[props.tier-1].length; i++) {
      if (position === PICKS_LEFT[props.tier-1][i].name) {
        setDrink(PICKS_LEFT[props.tier-1][i].beer);
        PICKS_LEFT[props.tier-1].splice(i, 1);
      }
    }

    setShowBoxes(false);
    props.setUseConfetti(true);
  }

  if (!draftBoxesIntialized) {
    PICKS_LEFT[props.tier-1].forEach((pick) => {
      console.log(pick.picture)
      draftBoxes.push(<DrinkBox image={pick.picture} name={pick.name} onClick={(e) => {handleSelection(e);}}/>)
    });
    setDraftBoxesIntialized(true);
  }
  
  return (
    <>
      {showBoxes ? 
        <DrinkTickerWrapper>
          {draftBoxes}
        </DrinkTickerWrapper>
        :
        <DrinkNameWrapper>{drink}</DrinkNameWrapper>
      }
    </>
  );
}

export default DraftDrink;
