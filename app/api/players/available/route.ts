import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DraftablePlayerType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('draftId');
    const seed = searchParams.get('seed') || '0';

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
    const currentPick = await db.get(`
      SELECT draft_order FROM draft_picks WHERE draft_id = ? AND drafted_player_id IS NULL ORDER BY id ASC LIMIT 1
    `, draftId);
    const totalPicks = await db.get(`
      SELECT COUNT(*) FROM draft_picks WHERE draft_id = ?
    `, draftId);

    // Count players by type
    const typeCounts = {
      good: availablePlayers.filter(p => p.type === 'good').length,
      mid: availablePlayers.filter(p => p.type === 'mid').length,
      bad: availablePlayers.filter(p => p.type === 'bad').length
    };

    // Calculate base probabilities based on draft progress
    const progress = currentPick / totalPicks;
    let probabilities = {
      good: Math.max(0.05, 0.8 - progress * 2), // Starts at 80%, decreases to 5%
      mid: 0.15 + Math.sin(progress * Math.PI) * 0.1, // Oscillates around 15%
      bad: Math.min(0.8, progress * 2) // Starts at 5%, increases to 80%
    };

    // Normalize probabilities
    const totalProb = probabilities.good + probabilities.mid + probabilities.bad;
    probabilities = {
      good: probabilities.good / totalProb,
      mid: probabilities.mid / totalProb,
      bad: probabilities.bad / totalProb
    };

    // Create a deterministic but pseudo-random value based on seed and current pick
    let seedValue = parseInt(seed) + currentPick;
    const getNextValue = () => {
      const x = Math.sin(seedValue++) * 10000;
      return x - Math.floor(x);
    };

    // Select tier based on probabilities
    const random = getNextValue();
    let selectedTier: DraftablePlayerType;

    console.log("Selected tier:", random, probabilities, typeCounts);

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
      console.log("No players available");
      return NextResponse.json([]);
    }

    console.log("Selected tier:", random, probabilities, typeCounts, selectedTier);

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