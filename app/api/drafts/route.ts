import { NextRequest, NextResponse } from 'next/server';
import { getAllDrafts, createDraft } from '@/lib/db';
import { Draft } from '@/lib/types';

// GET /api/drafts - Get all drafts
export async function GET(request: NextRequest) {
  try {
    const drafts = await getAllDrafts();
    return NextResponse.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/drafts - Create a new draft
export async function POST(request: NextRequest) {
  try {
    const body: Draft = await request.json();
    const newDraft = await createDraft(body);
    return NextResponse.json(newDraft, { status: 201 });
  } catch (error) {
    console.error('Error creating draft:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
