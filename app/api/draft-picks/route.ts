import { NextRequest, NextResponse } from 'next/server';
import { getAllDraftPicks, createDraftPick } from '@/lib/db';
import { DraftPick } from '@/lib/types';

// GET /api/draft-picks?draftId=X - Get all draft picks for a specific draft
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('draftId');
    
    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }
    
    const picks = await getAllDraftPicks(draftId);
    return NextResponse.json(picks);
  } catch (error) {
    console.error('Error fetching draft picks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/draft-picks - Create a new draft pick
export async function POST(request: NextRequest) {
  try {
    const body: DraftPick = await request.json();
    const newPick = await createDraftPick(body);
    console.log('New draft pick created:', newPick);
    return NextResponse.json(newPick, { status: 201 });
  } catch (error) {
    console.error('Error creating draft pick:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
