'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Person, Draft, Team, Beverage, DraftablePlayerType } from '@/lib/types';

export default function SetupDraft() {
  const router = useRouter();
  const [draftName, setDraftName] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [isIngestingTeams, setIsIngestingTeams] = useState(false);
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [newBeverageName, setNewBeverageName] = useState('');
  const [newBeverageType, setNewBeverageType] = useState<DraftablePlayerType>('good');
  const [drinksPerPerson, setDrinksPerPerson] = useState<number>(1);
  const [totalDrinksRequired, setTotalDrinksRequired] = useState<number>(0);
  const [randomizedPeople, setRandomizedPeople] = useState<Person[]>([]);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  useEffect(() => {
    // Fetch all people when component mounts
    fetch('/api/people')
      .then(res => res.json())
      .then(data => setPeople(data))
      .catch(err => setError('Failed to load people'));

    // Fetch all teams
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => setError('Failed to load teams'));

    // Calculate total drinks required based on selected people and drinks per person
    setTotalDrinksRequired(selectedPeople.size * drinksPerPerson);
  }, [selectedPeople, drinksPerPerson]);

  const filteredTeams = teams.filter(team => 
    team.mascot.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
    team.city.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  const handlePersonToggle = (personId: number) => {
    const newSelected = new Set(selectedPeople);
    if (newSelected.has(personId)) {
      newSelected.delete(personId);
    } else {
      newSelected.add(personId);
    }
    setSelectedPeople(newSelected);
  };

  const handleRandomizeOrder = () => {
    if (selectedPeople.size === 0) {
      setError('Please select at least one person to randomize');
      return;
    }

    // Get selected people objects
    const selectedPeopleObjects = people.filter(person => selectedPeople.has(person.id));
    
    // Randomize the order for the first round
    const shuffled = [...selectedPeopleObjects].sort(() => Math.random() - 0.5);
    setRandomizedPeople(shuffled);
  };

  // Calculate the draft order for a snake draft
  const calculateSnakeDraftOrder = (people: Person[]) => {
    const result: { person: Person, round: number, pick: number }[] = [];
    
    // Use drinksPerPerson as the number of rounds
    const rounds = drinksPerPerson;
    
    // For each round
    for (let round = 1; round <= rounds; round++) {
      // Determine if this round should be reversed (even rounds)
      const isReversed = round % 2 === 0;
      
      // Get the people in the correct order for this round
      const roundPeople = isReversed ? [...people].reverse() : [...people];
      
      // Add each person to the result with their round and pick number
      roundPeople.forEach((person, index) => {
        result.push({
          person,
          round,
          pick: index + 1
        });
      });
    }
    
    return result;
  };

  const handleCreateDraft = async () => {
    if (!draftName || !draftDate || selectedPeople.size === 0) {
      setError('Please fill in all required fields and select at least one person');
      return;
    }

    if (beverages.length < totalDrinksRequired) {
      setError(`Please add at least ${totalDrinksRequired} beverages (${drinksPerPerson} per person)`);
      return;
    }

    if (randomizedPeople.length === 0) {
      setError('Please randomize the draft order before creating the draft');
      return;
    }

    setIsCreatingDraft(true);
    setError('');

    try {
      // Create the draft
      const draftResponse = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: draftName, date: draftDate }),
      });

      if (!draftResponse.ok) throw new Error('Failed to create draft');
      const draft: Draft = await draftResponse.json();

      // Calculate the snake draft order
      const snakeDraftOrder = calculateSnakeDraftOrder(randomizedPeople);
      
      // Create draft picks for each person in the snake draft order
      const pickPromises = snakeDraftOrder.map(({ person, round, pick }) => 
        fetch('/api/draft-picks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draft_id: draft.id,
            person_id: person.id,
            draft_order: (round - 1) * randomizedPeople.length + pick,
            drafted_player_id: null, // Will be updated when player is selected
          }),
        })
      );

      await Promise.all(pickPromises);

      // Ingest players with the draft ID
      const playerResponse = await fetch('/api/players/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          beverages: beverages.slice(0, totalDrinksRequired), 
          draftId: draft.id 
        }),
      });

      if (!playerResponse.ok) throw new Error('Failed to ingest players');
      
      // Navigate to the drafts page
      router.push(`/draft/${draft.id}`);
    } catch (err) {
      setError('Failed to create draft');
      setIsCreatingDraft(false);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPlayerName.trim()) {
      setError('Please enter a player name');
      return;
    }

    try {
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newPlayerName,
          favorite_team_id: selectedTeamId
        }),
      });

      if (!response.ok) throw new Error('Failed to add player');
      
      const newPlayer = await response.json();
      setPeople([...people, newPlayer]);
      setNewPlayerName('');
      setSelectedTeamId(null);
      setTeamSearchQuery('');
      setShowAddPlayerForm(false);
    } catch (err) {
      setError('Failed to add player');
    }
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeamId(team.id);
    setTeamSearchQuery(`${team.city} ${team.mascot}`);
    setShowTeamDropdown(false);
  };

  const handleIngestTeams = async () => {
    setIsIngestingTeams(true);
    setError('');
    
    try {
      const response = await fetch('/api/teams/ingest', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to ingest teams');
      
      const ingestedTeams = await response.json();
      setTeams(ingestedTeams);
    } catch (err) {
      setError('Failed to ingest teams. Please try again.');
    } finally {
      setIsIngestingTeams(false);
    }
  };

  const handleAddBeverage = () => {
    if (!newBeverageName.trim()) return;
    
    const newBeverage: Beverage = {
      name: newBeverageName,
      quality: newBeverageType
    };
    
    setBeverages([...beverages, newBeverage]);
    setNewBeverageName('');
  };

  const handleRemoveBeverage = (index: number) => {
    setBeverages(beverages.filter((_, i) => i !== index));
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setSelectedTeamId(person.favorite_team_id || null);
    setTeamSearchQuery(person.favorite_team_id ? 
      `${person.city} ${person.mascot}` : '');
  };

  const handleSavePersonEdit = async () => {
    if (!editingPerson) return;
    
    try {
      const response = await fetch(`/api/people/${editingPerson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingPerson.name,
          favorite_team_id: selectedTeamId
        }),
      });

      if (!response.ok) throw new Error('Failed to update person');
      
      const updatedPerson = await response.json();
      
      // Update the person in the people array
      setPeople(people.map(p => 
        p.id === updatedPerson.id ? updatedPerson : p
      ));
      
      // Update in randomized people if present
      if (randomizedPeople.length > 0) {
        setRandomizedPeople(randomizedPeople.map(p => 
          p.id === updatedPerson.id ? updatedPerson : p
        ));
      }
      
      setEditingPerson(null);
      setSelectedTeamId(null);
      setTeamSearchQuery('');
    } catch (err) {
      setError('Failed to update person');
    }
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setSelectedTeamId(null);
    setTeamSearchQuery('');
  };

  const handleDeletePerson = async (personId: number) => {
    if (!confirm('Are you sure you want to delete this person? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/people/${personId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete person');
      
      // Remove the person from the people array
      setPeople(people.filter(p => p.id !== personId));
      
      // Remove from selected people if selected
      if (selectedPeople.has(personId)) {
        const newSelected = new Set(selectedPeople);
        newSelected.delete(personId);
        setSelectedPeople(newSelected);
      }
      
      // Remove from randomized people if present
      if (randomizedPeople.length > 0) {
        setRandomizedPeople(randomizedPeople.filter(p => p.id !== personId));
      }
    } catch (err) {
      setError('Failed to delete person');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Setup New Draft</h1>
      
      <div className="space-y-4">
        <form onSubmit={handleCreateDraft} className="space-y-4">
          <div>
            <label className="block mb-2">Draft Name:</label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Draft Date:</label>
            <input
              type="date"
              value={draftDate}
              onChange={(e) => setDraftDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Drinks Per Person:</label>
            <input
              type="number"
              min="1"
              value={drinksPerPerson}
              onChange={(e) => setDrinksPerPerson(parseInt(e.target.value) || 1)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Select Participants</h2>
            <div className="border rounded p-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Select</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Favorite Team</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person) => (
                    <tr key={person.id} className="border-t">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedPeople.has(person.id)}
                          onChange={() => handlePersonToggle(person.id)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="p-2">
                        {editingPerson?.id === person.id ? (
                          <input
                            type="text"
                            value={editingPerson.name}
                            onChange={(e) => setEditingPerson({...editingPerson, name: e.target.value})}
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          person.name
                        )}
                      </td>
                      <td className="p-2">
                        {editingPerson?.id === person.id ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={teamSearchQuery}
                              onChange={(e) => {
                                setTeamSearchQuery(e.target.value);
                                setShowTeamDropdown(true);
                              }}
                              onFocus={() => setShowTeamDropdown(true)}
                              placeholder="Search for a team..."
                              className="w-full p-1 border rounded"
                            />
                            
                            {showTeamDropdown && teamSearchQuery && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                {filteredTeams.length > 0 ? (
                                  filteredTeams.map(team => (
                                    <div
                                      key={team.id}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setSelectedTeamId(team.id);
                                        setTeamSearchQuery(`${team.city} ${team.mascot}`);
                                        setShowTeamDropdown(false);
                                      }}
                                    >
                                      {team.city} {team.mascot}
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-2 text-gray-500">No teams found</div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          person.favorite_team_id ? 
                            `${person.city} ${person.mascot}` : 
                            'No favorite team'
                        )}
                      </td>
                      <td className="p-2">
                        {editingPerson?.id === person.id ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={handleSavePersonEdit}
                              className="text-green-500 hover:text-green-700"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="text-red-500 hover:text-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPerson(person)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePerson(person.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {randomizedPeople.length > 0 && (
            <div className="border rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Draft Order (Snake Format)</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  The draft will follow a snake format with {drinksPerPerson} rounds, where the order reverses in each round.
                  This ensures fair distribution of picks across all rounds.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Round</th>
                      <th className="text-left p-2">Pick</th>
                      <th className="text-left p-2">Person</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculateSnakeDraftOrder(randomizedPeople).map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">Round {item.round}</td>
                        <td className="p-2">Pick {item.pick}</td>
                        <td className="p-2">{item.person.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRandomizeOrder}
              disabled={selectedPeople.size === 0}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-purple-300"
            >
              Randomize Draft Order
            </button>
          </div>

          {error && (
            <div className="text-red-500">{error}</div>
          )}

          <button
            type="button"
            onClick={handleCreateDraft}
            disabled={isCreatingDraft || randomizedPeople.length === 0 || beverages.length < totalDrinksRequired}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isCreatingDraft ? 'Creating Draft...' : 'Create Draft'}
          </button>
        </form>

        <div className="border rounded p-4">
          {showAddPlayerForm ? (
            <form onSubmit={handleAddPlayer} className="mt-4 space-y-4">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2">Player Name:</label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div className="relative">
                  <label className="block mb-2">Favorite Team (Optional):</label>
                  <input
                    type="text"
                    value={teamSearchQuery}
                    onChange={(e) => {
                      setTeamSearchQuery(e.target.value);
                      setShowTeamDropdown(true);
                    }}
                    onFocus={() => setShowTeamDropdown(true)}
                    placeholder="Search for a team..."
                    className="w-full p-2 border rounded"
                  />
                  
                  {showTeamDropdown && teamSearchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredTeams.length > 0 ? (
                        filteredTeams.map(team => (
                          <div
                            key={team.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleTeamSelect(team)}
                          >
                            {team.city} {team.mascot}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No teams found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlayerForm(false);
                    setNewPlayerName('');
                    setSelectedTeamId(null);
                    setTeamSearchQuery('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAddPlayerForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Player
              </button>
            </div>
          )}
        </div>

        {teams.length === 0 && (
          <div className="mt-8 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">No NFL Teams Found</h3>
            <p className="text-sm text-gray-600 mb-4">You need to ingest NFL teams before you can assign favorite teams to players.</p>
            <button
              type="button"
              onClick={handleIngestTeams}
              disabled={isIngestingTeams}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isIngestingTeams ? 'Ingesting Teams...' : 'Ingest NFL Teams'}
            </button>
          </div>
        )}

        <div className="mt-8 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-4">Alcoholic Beverages</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add beverages that will be used as player names in the draft.
            {totalDrinksRequired > 0 && (
              <span className="font-semibold"> Required: {beverages.length}/{totalDrinksRequired} beverages</span>
            )}
          </p>
          
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newBeverageName}
              onChange={(e) => setNewBeverageName(e.target.value)}
              placeholder="Enter beverage name"
              className="flex-1 p-2 border rounded"
            />
            <select
              value={newBeverageType}
              onChange={(e) => setNewBeverageType(e.target.value as DraftablePlayerType)}
              className="p-2 border rounded"
            >
              <option value="good">Good</option>
              <option value="mid">Mid</option>
              <option value="bad">Bad</option>
            </select>
            <button
              type="button"
              onClick={handleAddBeverage}
              disabled={!newBeverageName.trim()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
              Add
            </button>
          </div>
          
          {beverages.length > 0 ? (
            <>
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Quality</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beverages.map((beverage, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{beverage.name}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          beverage.quality === 'good' ? 'bg-green-100 text-green-800' :
                          beverage.quality === 'mid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {beverage.quality}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveBeverage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button
                type="button"
                onClick={handleCreateDraft}
                disabled={isCreatingDraft || randomizedPeople.length === 0 || beverages.length < totalDrinksRequired}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isCreatingDraft ? 'Creating Draft...' : 'Create Draft'}
              </button>
            </>
          ) : (
            <p className="text-gray-500 italic">No beverages added yet. Add beverages to create players.</p>
          )}
        </div>
      </div>
    </div>
  );
}
