import React, {useState} from "react";
import styled from "styled-components";
import draft from "./images/draft.png"
import {draftOrder} from "./const"

const DraftBoxWrapper = styled.div.attrs(props => ({color: props.color || "#36454F"}))`
  height: 100px;
  min-width: 100px;
  color: white;
  background-color: ${props => props.color};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const PickNumber = styled.div`
  text-align: center;
  font-size: 40px;
`;

const PickName = styled.div`
  text-align: center;
  font-size: 20px;
`;

const DraftTickerWrapper = styled.div`
  width: calc(100vw - 40px);
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow: hidden;
  padding: 20px;
  
`;

const ButtonWrapper1 = styled.div`
  width: 100%;
  position: relative;
  top: 67px;
`;

const ButtonWrapper2 = styled.div`
  margin: auto;
  width: fit-content;
`;

const NextPickButton = styled.button`
  width: 125px;
  height: 125px;
  padding: 10px;
  color: white;
  font-size: 20px;
  border: none;
  border-radius: 8px;
  transition: 0.3s;
  margin: auto;
  background-image: url(${draft});
  background-color: transparent;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  &:hover {
    transform: scale(110%);
  }
`;

const DraftBox = (props) => {
  return (
    <DraftBoxWrapper color={props.color}>
      <PickName>
        {props.name}
      </PickName>
      <PickNumber>
        {props.pick}
      </PickNumber>
    </DraftBoxWrapper>
  )
}


const DraftTicker = (props) => {
  const [draftBoxes, setDraftBoxes] = useState([]);
  const [draftBoxesIntialized, setDraftBoxesIntialized] = useState(false);
  const removeFirstBox = () => {
    setDraftBoxes(draftBoxes.slice(1, draftBoxes.length));
  }
  if (!draftBoxesIntialized) {
    draftOrder.forEach((player, i) => 
      draftBoxes.push(<DraftBox name={player.name} pick={i+1} color={player.color}/>)
    );
    setDraftBoxesIntialized(true);
  }
  
  return (
    <>
      <DraftTickerWrapper>
        {draftBoxes}
      </DraftTickerWrapper>
      <ButtonWrapper1>
        <ButtonWrapper2>
          <NextPickButton onClick={() => { props.onDraftClick(); removeFirstBox();}}>
          </NextPickButton>
        </ButtonWrapper2>
      </ButtonWrapper1>
    </>
  );
}

export default DraftTicker;
