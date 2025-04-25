import { NextRequest, NextResponse } from 'next/server';
import { createTeam, getAllTeams, deleteTeam } from '@/lib/db';
import { Team } from '@/lib/types';

interface NFLApiTeam {
  id: string;
  name: string;
  nickname: string;
  location: string;
  logos: Array<{ href: string; }>;
  color: string;
  alternateColor: string;
}

// GET /api/teams/ingest - Fetch teams from NFL API and populate database
export async function GET(request: NextRequest) {
  try {
    // Check if we already have teams in the database
    const existingTeams = await getAllTeams();
    
    // Delete existing teams if the reset parameter is set
    const { searchParams } = new URL(request.url);
    const reset = searchParams.get('reset');
    
    if (reset === 'true' && existingTeams.length > 0) {
      for (const team of existingTeams) {
        if (team.id) {
          await deleteTeam(team.id);
        }
      }
    } else if (existingTeams.length > 0 && reset !== 'true') {
      return NextResponse.json({
        message: 'Teams already exist. Use ?reset=true to reingest.',
        count: existingTeams.length,
        teams: existingTeams
      });
    }

    // Fetch data from the NFL API
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'nfl-api-data.p.rapidapi.com',
        'x-rapidapi-key': '3fa16c63c5msh4e29ac53939cc0bp1c3f1ajsnd5c9213bd211'
      }
    };

    const response = await fetch('https://nfl-api-data.p.rapidapi.com/nfl-team-listing/v1/data', options);
    
    if (!response.ok) {
      throw new Error(`NFL API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and insert teams
    const teams: Team[] = [];
    
    if (data && Array.isArray(data)) {
      for (const item of data) {
        const nflTeam = item.team as NFLApiTeam;
        
        const teamData: Team = {
          id: parseInt(nflTeam.id),
          city: nflTeam.location || 'Unknown',
          mascot: nflTeam.nickname || nflTeam.name,
          primary_color: `#${nflTeam.color}` || '#000000',
          secondary_color: `#${nflTeam.alternateColor}` || '#FFFFFF',
          logo_url: nflTeam.logos[0].href || null
        };
        
        // Insert into database
        const team = await createTeam(teamData);
        if (team) {
          teams.push(team);
        }
      }
    }

    return NextResponse.json({
      message: 'Successfully ingested teams from NFL API',
      count: teams.length,
      teams
    });
  } catch (error) {
    console.error('Error ingesting teams:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
