import { NextRequest, NextResponse } from 'next/server';
import { getPersonById, updatePerson, deletePerson } from '@/lib/db';
import { Person } from '@/lib/types';

// GET /api/people/[id] - Get a specific person
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const person = await getPersonById(params.id);
    
    if (!person) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(person);
  } catch (error) {
    console.error('Error fetching person:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/people/[id] - Update a person
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Person = await request.json();
    const updatedPerson = await updatePerson(params.id, body);
    
    if (!updatedPerson) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/people/[id] - Delete a person
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deletePerson(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
