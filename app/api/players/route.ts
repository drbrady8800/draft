import { NextRequest, NextResponse } from 'next/server';
import { getAllDraftablePlayers, createDraftablePlayer } from '@/lib/db';
import { DraftablePlayer } from '@/lib/types';

// GET /api/players - Get all draftable players
export async function GET(request: NextRequest) {
  try {
    const players = await getAllDraftablePlayers();
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/players - Create a new draftable player
export async function POST(request: NextRequest) {
  try {
    const body: DraftablePlayer = await request.json();
    const newPlayer = await createDraftablePlayer(body);
    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}