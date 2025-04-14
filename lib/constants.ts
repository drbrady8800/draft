// Define types for our data structures
export interface Player {
  color: string;
  name: string;
}

export interface Pick {
  name: string;
  beer: string;
  picture: string;
}

// Players
export const players: Record<string, Player> = {
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

export const draftOrder: Player[] = [
  players.Declan, players.Jacob, players.Aue, players.Ben, 
  players.Dan, players.Connor, players.Joey, players.Ethan, 
  players.Ethan, players.Joey, players.Connor, players.Dan, 
  players.Ben, players.Ben, players.Aue, players.Jacob, 
  players.Declan, players.Declan, players.Jacob, players.Aue, 
  players.Ben, players.Dan, players.Connor, players.Joey, players.Ethan
];

export let ONES_LEFT = 6;
export let TWOS_LEFT = 9;
export let THREES_LEFT = 9;
export let pick = 1;

export const PICKS_LEFT: Pick[][] = [
  [
    {
      name: "Offensive Tackle",
      beer: "Bold Rock Blackberry",
      picture: "/images/goodOline.jpg"
    },
    {
      name: "Quarterback",
      beer: "Wahoowa",
      picture: "/images/qbGood.jpeg"
    },
    {
      name: "Cornerback",
      beer: "Hoo Rah Ray",
      picture: "/images/cbgood.jpg"
    },
    {
      name: "Defensive End",
      beer: "Soju",
      picture: "/images/degood.jpg"
    },
    {
      name: "Wide Reciever",
      beer: "Bold Rock",
      picture: "/images/wrgood.jpg"
    },
    {
      name: "Linebacker",
      beer: "Good Vodka + mixer",
      picture: "/images/lbgood.jpg"
    },
  ],
  [
    {
      name: "Offensive Tackle",
      beer: "Michy",
      picture: "/images/ehhol.jpg"
    },
    {
      name: "Quarterback",
      beer: "ICED!!!!",
      picture: "/images/ehhqb.jpg"
    },
    {
      name: "Running Back",
      beer: "Atomic",
      picture: "/images/ehhrb.jpg"
    },
    {
      name: "Defensive End",
      beer: "Fireball",
      picture: "/images/ehhde.jpg"
    },
    {
      name: "Wide Reciever",
      beer: "Tank Dog",
      picture: "/images/ehhwr.jpg"
    },
    {
      name: "Linebacker",
      beer: "Coors Light",
      picture: "/images/ehhlb.jpg"
    },
    {
      name: "Safety",
      beer: "Water",
      picture: "/images/ehhs.jpg"
    },
    {
      name: "Corner Back",
      beer: "Pacifico",
      picture: "/images/ehhcb.jpg"
    },
    {
      name: "Center",
      beer: "(Bare)foot Wine",
      picture: "/images/ehhcen.jpg"
    },
  ],
  [
    {
      name: "Offensive Tackle",
      beer: "Tequila",
      picture: "/images/badol.jpg"
    },
    {
      name: "Punter",
      beer: "Michy Seltzer",
      picture: "/images/badp.jpg"
    },
    {
      name: "Cornerback",
      beer: "Budweiser",
      picture: "/images/badcb.jpg"
    },
    {
      name: "Defensive End",
      beer: "99 Vodka",
      picture: "/images/badde.jpg"
    },
    {
      name: "Wide Reciever",
      beer: "Foot Wine",
      picture: "/images/badwr.jpg"
    },
    {
      name: "Tight end",
      beer: "40",
      picture: "/images/badte.jpg"
    },
    {
      name: "Longsnapper",
      beer: "Surge",
      picture: "/images/badls.jpg"
    },
    {
      name: "Holder",
      beer: "Italian Soda",
      picture: "/images/badhold.jpg"
    },
    {
      name: "Right Guard",
      beer: "Vodka Shot",
      picture: "/images/badrg.jpg"
    },
  ],
];

const odds: [number, number, number][] = [
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
];

export const randomTier = (pick_number: number): number => {
  pick++;

  const tierOnes = odds[pick_number][0];
  const tierTwos = odds[pick_number][1];
  const tierThrees = odds[pick_number][2];

  const whichTier = Math.floor(Math.random() * 100);
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
};
