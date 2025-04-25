// app/api/players/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createDraftablePlayer } from '@/lib/db';
import { Beverage, DraftablePlayer, DraftablePlayerType } from '@/lib/types';

// Player data from ESPN
interface ESPNAthlete {
  id: string;
  displayName: string;
  weight: number;
  displayWeight: string;
  height: number;
  displayHeight: string;
  position: {
    id: string;
  };
  team: {
    location: string;
    name: string;
    abbreviation: string;
    shortDisplayName: string;
  };
  attributes: Array<{
    name: string;
    displayName: string;
    abbreviation: string;
    displayValue: string;
  }>;
  logo: {
    href: string;
  };
  guid: string;
  link: string;
}

// ESPN athlete details
interface ESPNAthleteDetails {
  video?: {
    posterImages?: {
      square?: {
        href?: string;
      };
    };
  };
  headshot?: {
    href?: string;
  };
}

// POST /api/players/generate - Generate players
export async function POST(request: NextRequest) {
  try {
    const { beverages, draftId } = await request.json();

    if (!beverages || !Array.isArray(beverages) || !draftId) {
      return NextResponse.json(
        { error: 'Invalid request. Please provide an array of beverages and a draftId' },
        { status: 400 }
      );
    }

    // Verify draftId is a number
    const draftIdNum = parseInt(String(draftId), 10);
    if (isNaN(draftIdNum)) {
      return NextResponse.json(
        { error: 'Invalid draftId: must be a number' },
        { status: 400 }
      );
    }

    // Categorize beverages by quality
    const categorizedBeverages: Record<DraftablePlayerType, Beverage[]> = {
      good: [],
      mid: [],
      bad: []
    };

    beverages.forEach((beverage: Beverage) => {
      if (beverage.quality && categorizedBeverages[beverage.quality]) {
        categorizedBeverages[beverage.quality].push(beverage);
      }
    });

    // Fetch and process players
    const players = await fetchAndProcessPlayers(categorizedBeverages, draftIdNum);

    // Return the created players
    return NextResponse.json({
      message: 'Players generated successfully',
      count: players.length,
      players
    });

  } catch (error) {
    console.error('Error generating players:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function fetchAndProcessPlayers(
  categorizedBeverages: Record<DraftablePlayerType, Beverage[]>,
  draftId: number
) {
  const createdPlayers = [];

  // Process each quality category
  for (const quality of ['good', 'mid', 'bad'] as DraftablePlayerType[]) {
    const beverages = categorizedBeverages[quality];
    
    if (beverages.length === 0) continue;

    // Fetch players from ESPN API based on quality
    const espnAthletes = await fetchESPNAthletes(quality);

    // Randomly assign beverages to players
    const shuffledBeverages = [...beverages].sort(() => Math.random() - 0.5);
    
    // Match beverages to players and save to DB
    for (let i = 0; i < Math.min(shuffledBeverages.length, espnAthletes.length); i++) {
      const beverage = shuffledBeverages[i];
      const espnAthlete = espnAthletes[i];
      
      // Get player image URL
      const imageUrl = await fetchPlayerImageUrl(espnAthlete.id);
      
      // Create player object
      const playerData: DraftablePlayer = {
        id: 0, // Will be replaced by database
        type: quality,
        name: beverage.name,
        image_url: imageUrl,
        draft_id: draftId
      };
      
      // Save to database using the provided db utility function
      const player = await createDraftablePlayer(playerData);
      
      if (player) {
        createdPlayers.push({
          ...player,
          quality,
          espnId: espnAthlete.id,
          espnName: espnAthlete.displayName
        });
      }
    }
  }

  return createdPlayers;
}

async function fetchESPNAthletes(quality: DraftablePlayerType): Promise<ESPNAthlete[]> {
  try {
    const response = await fetch(
      `https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/draft`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`ESPN API returned ${response.status}`);
    }
    
    const data = await response.json();
    const allAthletes = data?.picks.filter((pick: any) => pick.athlete).map((pick: any) => pick.athlete) || [];
    const totalAthletes = allAthletes.length;
    const thirdSize = Math.floor(totalAthletes / 3);
    
    switch (quality) {
      case 'good':
        return allAthletes.slice(0, thirdSize);
      case 'mid':
        return allAthletes.slice(thirdSize, thirdSize * 2);
      case 'bad':
        return allAthletes.slice(thirdSize * 2);
      default:
        return [];
    }
  } catch (error) {
    console.error('Error fetching ESPN players:', error);
    return [];
  }
}

async function fetchPlayerImageUrl(athleteId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/draft/athlete/${athleteId}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    
    if (!response.ok) {
      throw new Error(`ESPN athlete API returned ${response.status}`);
    }
    
    const data: ESPNAthleteDetails = await response.json();
    
    // Try to get the square image URL first, fall back to headshot
    const squareImageUrl = data?.video?.posterImages?.square?.href;
    const headshotUrl = data?.headshot?.href;
    
    return squareImageUrl || headshotUrl || '';
  } catch (error) {
    console.error(`Error fetching image URL for athlete ${athleteId}:`, error);
    return '';
  }
}
