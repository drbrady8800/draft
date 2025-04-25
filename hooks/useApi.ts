import useSWR from 'swr';
import { Draft, Person, Team, DraftablePlayer, DraftPick, Beverage } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Draft hooks
export function useDrafts() {
  const { data, error, isLoading, mutate } = useSWR<Draft[]>('/api/drafts', fetcher);
  return { drafts: data, isLoading, isError: error, mutate };
}

export function useDraft(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Draft>(`/api/drafts/${id}`, fetcher);
  return { draft: data, isLoading, isError: error, mutate };
}

// People hooks
export function usePeople() {
  const { data, error, isLoading, mutate } = useSWR<Person[]>('/api/people', fetcher);
  return { people: data, isLoading, isError: error, mutate };
}

export function usePerson(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Person>(`/api/people/${id}`, fetcher);
  return { person: data, isLoading, isError: error, mutate };
}

// Teams hooks
export function useTeams() {
  const { data, error, isLoading, mutate } = useSWR<Team[]>('/api/teams', fetcher);
  return { teams: data, isLoading, isError: error, mutate };
}

export function useTeam(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Team>(`/api/teams/${id}`, fetcher);
  return { team: data, isLoading, isError: error, mutate };
}

// Players hooks
export function usePlayers() {
  const { data, error, isLoading, mutate } = useSWR<DraftablePlayer[]>('/api/players', fetcher);
  return { players: data, isLoading, isError: error, mutate };
}

export function usePlayer(id: string) {
  const { data, error, isLoading, mutate } = useSWR<DraftablePlayer>(`/api/players/${id}`, fetcher);
  return { player: data, isLoading, isError: error, mutate };
}

// Draft picks hooks
export function useDraftPicks(draftId: string) {
  const { data, error, isLoading, mutate } = useSWR<DraftPick[]>(
    draftId ? `/api/draft-picks?draftId=${draftId}` : null,
    fetcher
  );
  return { draftPicks: data, isLoading, isError: error, mutate };
}

export function useDraftPick(id: string) {
  const { data, error, isLoading, mutate } = useSWR<DraftPick>(`/api/draft-picks/${id}`, fetcher);
  return { draftPick: data, isLoading, isError: error, mutate };
}

// API mutation functions
export const api = {
  // Draft mutations
  createDraft: async (draft: Partial<Draft>) => {
    const response = await fetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    return response.json();
  },

  updateDraft: async (id: string, draft: Partial<Draft>) => {
    const response = await fetch(`/api/drafts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    return response.json();
  },

  deleteDraft: async (id: string) => {
    await fetch(`/api/drafts/${id}`, { method: 'DELETE' });
  },

  // People mutations
  createPerson: async (person: Partial<Person>) => {
    const response = await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });
    return response.json();
  },

  updatePerson: async (id: string, person: Partial<Person>) => {
    const response = await fetch(`/api/people/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });
    return response.json();
  },

  deletePerson: async (id: string) => {
    await fetch(`/api/people/${id}`, { method: 'DELETE' });
  },

  // Team mutations
  createTeam: async (team: Partial<Team>) => {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  updateTeam: async (id: string, team: Partial<Team>) => {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  deleteTeam: async (id: string) => {
    await fetch(`/api/teams/${id}`, { method: 'DELETE' });
  },

  // Player mutations
  createPlayer: async (player: Partial<DraftablePlayer>) => {
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });
    return response.json();
  },

  updatePlayer: async (id: string, player: Partial<DraftablePlayer>) => {
    const response = await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });
    return response.json();
  },

  deletePlayer: async (id: string) => {
    await fetch(`/api/players/${id}`, { method: 'DELETE' });
  },

  // Draft pick mutations
  createDraftPick: async (draftPick: Partial<DraftPick>) => {
    const response = await fetch('/api/draft-picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftPick),
    });
    return response.json();
  },

  updateDraftPick: async (id: string, draftPick: Partial<DraftPick>) => {
    const response = await fetch(`/api/draft-picks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftPick),
    });
    return response.json();
  },

  deleteDraftPick: async (id: string) => {
    await fetch(`/api/draft-picks/${id}`, { method: 'DELETE' });
  },

  // Special endpoints
  ingestTeams: async (reset: boolean = false) => {
    const response = await fetch(`/api/teams/ingest${reset ? '?reset=true' : ''}`);
    return response.json();
  },

  ingestPlayers: async (beverages: Beverage[], draftId: number) => {
    const response = await fetch('/api/players/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beverages, draftId }),
    });
    return response.json();
  },

  getAvailablePlayers: async (draftId: string) => {
    const response = await fetch(
      `/api/players/available?draftId=${draftId}`
    );
    return response.json();
  },
}; 