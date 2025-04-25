import { NextRequest, NextResponse } from 'next/server';
import { getDraftPickById, updateDraftPick, deleteDraftPick } from '@/lib/db';
import { DraftPick } from '@/lib/types';

// GET /api/draft-picks/[id] - Get a specific draft pick
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pick = await getDraftPickById(params.id);
    
    if (!pick) {
      return NextResponse.json(
        { error: 'Draft pick not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(pick);
  } catch (error) {
    console.error('Error fetching draft pick:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/draft-picks/[id] - Update a draft pick
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: DraftPick = await request.json();
    const updatedPick = await updateDraftPick(params.id, body);
    
    if (!updatedPick) {
      return NextResponse.json(
        { error: 'Draft pick not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPick);
  } catch (error) {
    console.error('Error updating draft pick:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/draft-picks/[id] - Delete a draft pick
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDraftPick(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting draft pick:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
