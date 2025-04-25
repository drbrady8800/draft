import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DraftablePlayerType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('draftId');

    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Get all undrafted players for this draft
    const availablePlayers = await db.all(`
      SELECT dp.* 
      FROM draftable_players dp
      LEFT JOIN draft_picks dpp ON dp.id = dpp.drafted_player_id
      WHERE dp.draft_id = ? AND dpp.id IS NULL
      ORDER BY dp.id
    `, draftId);

    // Get the current pick and the total number of picks
    const currentPickResult = await db.get(`
      SELECT draft_order FROM draft_picks WHERE draft_id = ? AND drafted_player_id IS NULL ORDER BY draft_order ASC LIMIT 1
    `, draftId);
    const totalPicksResult = await db.get(`
      SELECT COUNT(*) as count FROM draft_picks WHERE draft_id = ?
    `, draftId);

    const currentPick = currentPickResult?.draft_order || 0;
    const totalPicks = totalPicksResult?.count || 0;
    // Count players by type
    const typeCounts = {
      good: availablePlayers.filter(p => p.type === 'good').length,
      mid: availablePlayers.filter(p => p.type === 'mid').length,
      bad: availablePlayers.filter(p => p.type === 'bad').length
    };

    // Calculate base probabilities based on draft progress
    const progress = currentPick / totalPicks;
    let probabilities = {
      good: Math.max(0.1, 0.8 - (progress / 3)), // Starts at 80%, decreases to 10%
      mid: Math.exp(-Math.pow((progress - 0.5) * 2.5, 2)) * 0.6, // Bell curve centered at 50% progress
      bad: Math.min(0.8, Math.max(0.1, progress / 3)) // Starts at 10%, increases to 80%
    };


    // Adjust probabilities based on remaining quantities
    // If there are very few of a type left, reduce its probability
    const totalPlayers = typeCounts.good + typeCounts.mid + typeCounts.bad;
    
    if (totalPlayers > 0) {
      // Calculate scarcity factors - lower values mean more scarcity
      const scarcityFactors = {
        good: typeCounts.good / totalPlayers,
        mid: typeCounts.mid / totalPlayers,
        bad: typeCounts.bad / totalPlayers
      };
      
      // Apply scarcity factors to probabilities
      probabilities.good *= scarcityFactors.good;
      probabilities.mid *= scarcityFactors.mid;
      probabilities.bad *= scarcityFactors.bad;
    }


    // Normalize probabilities
    const totalProb = probabilities.good + probabilities.mid + probabilities.bad;
    probabilities = {
      good: probabilities.good / totalProb,
      mid: probabilities.mid / totalProb,
      bad: probabilities.bad / totalProb
    };

    // Generate a random number between 0 and 1
    const getNextValue = () => Math.random();

    // Select tier based on probabilities
    const random = getNextValue();
    let selectedTier: DraftablePlayerType;


    if (random < probabilities.good && typeCounts.good > 0) {
      selectedTier = 'good';
    } else if (random < probabilities.good + probabilities.mid && typeCounts.mid > 0) {
      selectedTier = 'mid';
    } else if (typeCounts.bad > 0) {
      selectedTier = 'bad';
    } else if (typeCounts.good > 0) {
      selectedTier = 'good';
    } else if (typeCounts.mid > 0) {
      selectedTier = 'mid';
    } else {
      return NextResponse.json([]);
    }

    // Return all players from the selected tier
    const tierPlayers = availablePlayers.filter(p => p.type === selectedTier);

    return NextResponse.json(tierPlayers);
  } catch (error) {
    console.error('Error fetching available players:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
