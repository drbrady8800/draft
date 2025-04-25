import { NextRequest, NextResponse } from 'next/server';
import { getAllTeams, createTeam } from '@/lib/db';
import { Team } from '@/lib/types';

// GET /api/teams - Get all teams
export async function GET(request: NextRequest) {
  try {
    const teams = await getAllTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const body: Team = await request.json();
    const newTeam = await createTeam(body);
    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
