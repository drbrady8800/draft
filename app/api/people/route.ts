import { NextRequest, NextResponse } from 'next/server';
import { getAllPeople, createPerson } from '@/lib/db';
import { Person } from '@/lib/types';

// GET /api/people - Get all people
export async function GET(request: NextRequest) {
  try {
    const people = await getAllPeople();
    return NextResponse.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/people - Create a new person
export async function POST(request: NextRequest) {
  try {
    const body: Person = await request.json();
    const newPerson = await createPerson(body);
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
