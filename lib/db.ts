// lib/db.ts
import sqlite3 from 'sqlite3';
import { Database, ISqlite, open } from 'sqlite';
import { Team, Person, DraftablePlayer, Draft, DraftPick } from './types';

// Export a singleton database connection
let db: Database | null = null;

export async function getDb() {
  if (db) {
    return db;
  }
  
  // Open the database
  db = await open({
    filename: './draft.sqlite',
    driver: sqlite3.Database
  });
  
  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      mascot TEXT NOT NULL,
      primary_color TEXT NOT NULL,
      secondary_color TEXT,
      logo_url TEXT,
      UNIQUE(city, mascot)
    );

    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      favorite_team_id INTEGER,
      FOREIGN KEY (favorite_team_id) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS draftable_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draft_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('good', 'mid', 'bad')), 
      image_url TEXT,
      FOREIGN KEY (draft_id) REFERENCES drafts(id)
    );

    CREATE TABLE IF NOT EXISTS drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS draft_picks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draft_order INTEGER NOT NULL,
      person_id INTEGER NOT NULL,
      draft_id INTEGER NOT NULL,
      drafted_player_id INTEGER,
      FOREIGN KEY (person_id) REFERENCES people(id),
      FOREIGN KEY (draft_id) REFERENCES drafts(id),
      FOREIGN KEY (drafted_player_id) REFERENCES draftable_players(id),
      UNIQUE(draft_id, draft_order),
      UNIQUE(draft_id, drafted_player_id)
    );
  `);

  return db;
}

// Helper functions for each table

// Teams
export async function getAllTeams(): Promise<Team[]> {
  const db = await getDb();
  return db.all<Team[]>('SELECT * FROM teams ORDER BY city');
}

export async function getTeamById(id: number | string): Promise<Team | undefined> {
  const db = await getDb();
  return db.get<Team>('SELECT * FROM teams WHERE id = ?', id);
}

export async function createTeam(team: Team): Promise<Team | undefined> {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO teams (city, mascot, primary_color, secondary_color, logo_url) VALUES (?, ?, ?, ?, ?)',
    [team.city, team.mascot, team.primary_color, team.secondary_color || null, team.logo_url || null]
  );
  return result.lastID ? getTeamById(result.lastID) : undefined;
}

export async function updateTeam(id: number | string, team: Team): Promise<Team | undefined> {
  const db = await getDb();
  await db.run(
    'UPDATE teams SET city = ?, mascot = ?, primary_color = ?, secondary_color = ?, logo_url = ? WHERE id = ?',
    [team.city, team.mascot, team.primary_color, team.secondary_color || null, team.logo_url || null, id]
  );
  return getTeamById(id);
}

export async function deleteTeam(id: number | string): Promise<ISqlite.RunResult<sqlite3.Statement>> {
  const db = await getDb();
  return db.run('DELETE FROM teams WHERE id = ?', id);
}

// People
export async function getAllPeople(): Promise<Person[]> {
  const db = await getDb();
  return db.all<Person[]>(`
    SELECT p.*, t.city, t.mascot, t.primary_color, t.secondary_color
    FROM people p
    LEFT JOIN teams t ON p.favorite_team_id = t.id
    ORDER BY p.name
  `);
}

export async function getPersonById(id: number | string): Promise<Person | undefined> {
  const db = await getDb();
  return db.get<Person>(`
    SELECT p.*, t.city, t.mascot, t.primary_color, t.secondary_color
    FROM people p
    LEFT JOIN teams t ON p.favorite_team_id = t.id
    WHERE p.id = ?
  `, id);
}

export async function createPerson(person: Person): Promise<Person | undefined> {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO people (name, favorite_team_id) VALUES (?, ?)',
    [person.name, person.favorite_team_id || null]
  );
  return result.lastID ? getPersonById(result.lastID) : undefined;
}

export async function updatePerson(id: number | string, person: Person): Promise<Person | undefined> {
  const db = await getDb();
  await db.run(
    'UPDATE people SET name = ?, favorite_team_id = ? WHERE id = ?',
    [person.name, person.favorite_team_id || null, id]
  );
  return getPersonById(id);
}

export async function deletePerson(id: number | string): Promise<ISqlite.RunResult<sqlite3.Statement>> {
  const db = await getDb();
  return db.run('DELETE FROM people WHERE id = ?', id);
}

// Draftable Players
export async function getAllDraftablePlayers(): Promise<DraftablePlayer[]> {
  const db = await getDb();
  return db.all<DraftablePlayer[]>('SELECT * FROM draftable_players ORDER BY name');
}

export async function getDraftablePlayerById(id: number | string): Promise<DraftablePlayer | undefined> {
  const db = await getDb();
  return db.get<DraftablePlayer>('SELECT * FROM draftable_players WHERE id = ?', id);
}

export async function createDraftablePlayer(player: DraftablePlayer): Promise<DraftablePlayer | undefined> {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO draftable_players (name, image_url, draft_id, type) VALUES (?, ?, ?, ?)',
    [player.name, player.image_url || null, player.draft_id, player.type]
  );
  return result.lastID ? getDraftablePlayerById(result.lastID) : undefined;
}

export async function updateDraftablePlayer(id: number | string, player: DraftablePlayer): Promise<DraftablePlayer | undefined> {
  const db = await getDb();
  await db.run(
    'UPDATE draftable_players SET name = ?, image_url = ?, type = ? WHERE id = ?',
    [player.name, player.image_url || null, player.type, id]
  );
  return getDraftablePlayerById(id);
}

export async function deleteDraftablePlayer(id: number | string): Promise<ISqlite.RunResult<sqlite3.Statement>> {
  const db = await getDb();
  return db.run('DELETE FROM draftable_players WHERE id = ?', id);
}

// Drafts
export async function getAllDrafts(): Promise<Draft[]> {
  const db = await getDb();
  return db.all<Draft[]>('SELECT * FROM drafts ORDER BY date DESC');
}

export async function getDraftById(id: number | string): Promise<Draft | undefined> {
  const db = await getDb();
  return db.get<Draft>('SELECT * FROM drafts WHERE id = ?', id);
}

export async function createDraft(draft: Draft): Promise<Draft | undefined> {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO drafts (name, date) VALUES (?, ?)',
    [draft.name, draft.date]
  );
  return result.lastID ? getDraftById(result.lastID) : undefined;
}

export async function updateDraft(id: number | string, draft: Draft): Promise<Draft | undefined> {
  const db = await getDb();
  await db.run(
    'UPDATE drafts SET name = ?, date = ? WHERE id = ?',
    [draft.name, draft.date, id]
  );
  return getDraftById(id);
}

export async function deleteDraft(id: number | string): Promise<ISqlite.RunResult<sqlite3.Statement>> {
  const db = await getDb();
  return db.run('DELETE FROM drafts WHERE id = ?', id);
}

// Draft Picks
export async function getAllDraftPicks(draftId: number | string): Promise<DraftPick[]> {
  const db = await getDb();
  return db.all<DraftPick[]>(`
    SELECT dp.*, 
           p.name as person_name,
           pl.name as player_name,
           pl.image_url as player_image,
           pl.type as player_type,
           t.primary_color as team_primary_color,
           t.secondary_color as team_secondary_color
    FROM draft_picks dp
    JOIN people p ON dp.person_id = p.id
    LEFT JOIN draftable_players pl ON dp.drafted_player_id = pl.id
    LEFT JOIN teams t ON p.favorite_team_id = t.id
    WHERE dp.draft_id = ?
    ORDER BY dp.draft_order
  `, draftId);
}

export async function getDraftPickById(id: number | string): Promise<DraftPick | undefined> {
  const db = await getDb();
  return db.get<DraftPick>(`
    SELECT dp.*, 
           p.name as person_name,
           pl.name as player_name,
           pl.image_url as player_image,
           pl.type as player_type,
           t.primary_color as team_primary_color,
           t.secondary_color as team_secondary_color
    FROM draft_picks dp
    JOIN people p ON dp.person_id = p.id
    LEFT JOIN draftable_players pl ON dp.drafted_player_id = pl.id
    LEFT JOIN teams t ON p.favorite_team_id = t.id
    WHERE dp.id = ?
  `, id);
}

export async function createDraftPick(draftPick: DraftPick): Promise<DraftPick | undefined> {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO draft_picks (draft_order, person_id, draft_id, drafted_player_id) VALUES (?, ?, ?, ?)',
    [draftPick.draft_order, draftPick.person_id, draftPick.draft_id, draftPick.drafted_player_id]
  );
  console.log('Draft pick created:', result, result.lastID, result.lastID && await getDraftPickById(result.lastID));
  return result.lastID ? getDraftPickById(result.lastID) : undefined;
}

export async function updateDraftPick(id: number | string, draftPick: DraftPick): Promise<DraftPick | undefined> {
  const db = await getDb();
  await db.run(
    'UPDATE draft_picks SET draft_order = ?, person_id = ?, draft_id = ?, drafted_player_id = ? WHERE id = ?',
    [draftPick.draft_order, draftPick.person_id, draftPick.draft_id, draftPick.drafted_player_id, id]
  );
  return getDraftPickById(id);
}

export async function deleteDraftPick(id: number | string): Promise<ISqlite.RunResult<sqlite3.Statement>> {
  const db = await getDb();
  return db.run('DELETE FROM draft_picks WHERE id = ?', id);
}
