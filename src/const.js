import goodOline from "./images/goodOline.jpg";
import qbGood from "./images/qbGood.jpeg";
import cbgood from "./images/cbgood.jpg";
import degood from "./images/degood.jpg";
import wrgood from "./images/wrgood.jpg";
import lbgood from "./images/lbgood.jpg";
import ehhol from "./images/ehhol.jpg";
import ehhrb from "./images/ehhrb.jpg";
import ehhqb from "./images/ehhqb.jpg";
import ehhde from "./images/ehhde.jpg";
import ehhwr from "./images/ehhwr.jpg";
import ehhlb from "./images/ehhlb.jpg";
import ehhs from "./images/ehhs.jpg";
import ehhcb from "./images/ehcb.jpg";
import ehhcen from "./images/ehcen.jpg";
import badol from "./images/badol.jpg";
import badp from "./images/badp.jpg";
import badcb from "./images/badcb.jpg";
import badde from "./images/badde.jpg";
import badwr from "./images/badwr.jpg";
import badte from "./images/badte.jpg";
import badls from "./images/badls.jpg";
import badhold from "./images/badhold.jpg";
import badrg from "./images/badrg.jpg";

export const players = {
  Declan: {
    color: "#004C54",
    name: "Declan",
  },
  Aue: {
    color: "#004C54",
    name: "Aue",
  },
  Dan: {
    color: "#041E42",
    name: "Dan",
  },
  Jacob: {
    color: "#0B2265",
    name: "Jacob",
  },
  Ethan: {
    color: "#D3BC8D",
    name: "Ethan",
  },
  Connor: {
    color: "#004C54",
    name: "Connor",
  },
  Ben: {
    color: "#FB4004",
    name: "Ben",
  },
  Joey: {
    color: "#041E42",
    name: "Joey",
  },
};

export const draftOrder = [players.Declan, players.Jacob, players.Aue, players.Ben, players.Dan, players.Connor, players.Joey, players.Ethan, players.Ethan, players.Joey, players.Connor, players.Dan, players.Ben, players.Ben, players.Aue, players.Jacob, players.Declan, players.Declan, players.Jacob, players.Aue, players.Ben, players.Dan, players.Connor, players.Joey, players.Ethan];

export var ONES_LEFT = 6;
export var TWOS_LEFT = 9;
export var THREES_LEFT = 9;
export var pick = 1;

export var PICKS_LEFT = [
  [
    {
      name: "Offensive Tackle",
      beer: "bold rock blackberry",
      picture: goodOline
    },
    {
      name: "Quarterback",
      beer: "Wahoowa",
      picture: qbGood
    },
    {
      name: "Cornerback",
      beer: "Hoo Rah Ray",
      picture: cbgood
    },
    {
      name: "Defensive End",
      beer: "Soju",
      picture: degood
    },
    {
      name: "Wide Reciever",
      beer: "Bold Rock",
      picture: wrgood
    },
    {
      name: "Linebacker",
      beer: "Good Vodka + mixer",
      picture: lbgood
    },
  ],
  [
    {
      name: "Offensive Tackle",
      beer: "Michy",
      picture: ehhol
    },
    {
      name: "Quarterback",
      beer: "ICED!!!!",
      picture: ehhqb
    },
    {
      name: "Running Back",
      beer: "Atomic",
      picture: ehhrb
    },
    {
      name: "Defensive End",
      beer: "Fireball",
      picture: ehhde
    },
    {
      name: "Wide Reciever",
      beer: "Tank Dog",
      picture: ehhwr
    },
    {
      name: "Linebacker",
      beer: "Coors Light",
      picture: ehhlb
    },
    {
      name: "Safety",
      beer: "Water",
      picture: ehhs
    },
    {
      name: "Corner Back",
      beer: "Pacifico",
      picture: ehhcb
    },
    {
      name: "Center",
      beer: "(Bare)foot Wine",
      picture: ehhcen
    },
  ],
  [
    {
      name: "Offensive Tackle",
      beer: "Tequila",
      picture: badol
    },
    {
      name: "Punter",
      beer: "Michy Seltzer",
      picture: badp
    },
    {
      name: "Cornerback",
      beer: "Budweiser",
      picture: badcb
    },
    {
      name: "Defensive End",
      beer: "99 Vodka",
      picture: badde
    },
    {
      name: "Wide Reciever",
      beer: "Foot Wine",
      picture: badwr
    },
    {
      name: "Tight end",
      beer: "40",
      picture: badte
    },
    {
      name: "Longsnapper",
      beer: "Surge",
      picture: badls
    },
    {
      name: "Holder",
      beer: "Italian Soda",
      picture: badhold
    },
    {
      name: "Right Guard",
      beer: "Vodka Shot",
      picture: badrg
    },
  ],
];

const odds = [
  [80, 15, 5],
  [75, 20, 5],
  [70, 24, 6],
  [60, 30, 10],
  [50, 35, 15],
  [45, 37, 18],
  [40, 40, 20],
  [35, 42, 23],
  [30, 45, 25],
  [27, 46, 27],
  [24, 48, 28],
  [0, 50, 50],
  [21, 50, 29],
  [18, 50, 31],
  [15, 45, 40],
  [12, 40, 48],
  [10, 35, 55],
  [50, 15, 35],
  [8, 30, 62],
  [6, 27, 67],
  [5, 24, 71],
  [5, 21, 74],
  [5, 20, 75],
  [5, 15, 80]
]

export const randomTier = (pick_number) => {
  pick++;

  const tierOnes = odds[pick_number][0];
  const tierTwos = odds[pick_number][1];
  const tierThrees = odds[pick_number][2];

  const whichTier = parseInt(Math.random() * 100);
  if (whichTier < tierOnes) {
    if (ONES_LEFT > 0) {
      ONES_LEFT--;
      return 1;
    } else if (TWOS_LEFT > 0) {
      TWOS_LEFT--;
      return 2;
    } else {
      THREES_LEFT--;
      return 3;
    }
  } else if (whichTier < tierOnes + tierTwos) {
    if (TWOS_LEFT > 0) {
      TWOS_LEFT--;
      return 2;
    } else if (THREES_LEFT > 0) {
      THREES_LEFT--;
      return 3;
    } else {
      ONES_LEFT--;
      return 1;
    }
  } else {
    if (THREES_LEFT > 0) {
      THREES_LEFT--;
      return 3;
    } else if (TWOS_LEFT > 0) {
      TWOS_LEFT--;
      return 2;
    } else {
      ONES_LEFT--;
      return 1;
      
    }
  }
}