
import { useState } from "react";
import { useCricket } from "../context/CricketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Player } from "../context/CricketContext";

const MatchSetup = () => {
  const { dispatch } = useCricket();
  
  // Pre-filled data
  const [stadium, setStadium] = useState('Wankhede Stadium, Mumbai');
  const [team1Name, setTeam1Name] = useState('Mumbai Indians');
  const [team2Name, setTeam2Name] = useState('Chennai Super Kings');
  const [tossWinner, setTossWinner] = useState('Mumbai Indians');
  const [totalOvers, setTotalOvers] = useState(20);
  
  // Pre-filled MI players
  const [team1Players, setTeam1Players] = useState<Array<{name: string, type: 'batsman' | 'bowler' | 'all-rounder', role: 'player' | 'wicket-keeper' | 'captain'}>>([
    { name: 'Rohit Sharma', type: 'batsman', role: 'captain' },
    { name: 'Ishan Kishan', type: 'batsman', role: 'wicket-keeper' },
    { name: 'Suryakumar Yadav', type: 'batsman', role: 'player' },
    { name: 'Tilak Varma', type: 'batsman', role: 'player' },
    { name: 'Hardik Pandya', type: 'all-rounder', role: 'player' },
    { name: 'Kieron Pollard', type: 'all-rounder', role: 'player' },
    { name: 'Krunal Pandya', type: 'all-rounder', role: 'player' },
    { name: 'Jasprit Bumrah', type: 'bowler', role: 'player' },
    { name: 'Trent Boult', type: 'bowler', role: 'player' },
    { name: 'Rahul Chahar', type: 'bowler', role: 'player' },
    { name: 'Nathan Coulter-Nile', type: 'bowler', role: 'player' }
  ]);

  // Pre-filled CSK players
  const [team2Players, setTeam2Players] = useState<Array<{name: string, type: 'batsman' | 'bowler' | 'all-rounder', role: 'player' | 'wicket-keeper' | 'captain'}>>([
    { name: 'MS Dhoni', type: 'batsman', role: 'captain' },
    { name: 'Ruturaj Gaikwad', type: 'batsman', role: 'wicket-keeper' },
    { name: 'Faf du Plessis', type: 'batsman', role: 'player' },
    { name: 'Ambati Rayudu', type: 'batsman', role: 'player' },
    { name: 'Ravindra Jadeja', type: 'all-rounder', role: 'player' },
    { name: 'Moeen Ali', type: 'all-rounder', role: 'player' },
    { name: 'Suresh Raina', type: 'batsman', role: 'player' },
    { name: 'Deepak Chahar', type: 'bowler', role: 'player' },
    { name: 'Shardul Thakur', type: 'bowler', role: 'player' },
    { name: 'Imran Tahir', type: 'bowler', role: 'player' },
    { name: 'Josh Hazlewood', type: 'bowler', role: 'player' }
  ]);

  const handlePlayerChange = (teamIndex: 1 | 2, playerIndex: number, field: string, value: string) => {
    if (teamIndex === 1) {
      const newPlayers = [...team1Players];
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], [field]: value };
      setTeam1Players(newPlayers);
    } else {
      const newPlayers = [...team2Players];
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], [field]: value };
      setTeam2Players(newPlayers);
    }
  };

  const handleSubmit = () => {
    const team1PlayersData: Player[] = team1Players
      .filter(player => player.name.trim())
      .map((player, index) => ({
        id: `team1_${index}`,
        name: player.name.trim(),
        type: player.type,
        role: player.role,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        isBatting: false,
        isOnStrike: false
      }));

    const team2PlayersData: Player[] = team2Players
      .filter(player => player.name.trim())
      .map((player, index) => ({
        id: `team2_${index}`,
        name: player.name.trim(),
        type: player.type,
        role: player.role,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        isBatting: false,
        isOnStrike: false
      }));

    // Set first two batsmen for batting team
    if (team1PlayersData.length >= 2) {
      team1PlayersData[0].isBatting = true;
      team1PlayersData[0].isOnStrike = true;
      team1PlayersData[1].isBatting = true;
      team1PlayersData[1].isOnStrike = false;
    }

    dispatch({
      type: 'SETUP_MATCH',
      matchData: {
        stadium,
        tossWinner,
        totalOvers,
        battingTeam: tossWinner === team1Name ? 'team1' : 'team2',
        bowlingTeam: tossWinner === team1Name ? 'team2' : 'team1'
      }
    });

    dispatch({
      type: 'UPDATE_TEAMS',
      team1: {
        name: team1Name,
        players: team1PlayersData
      },
      team2: {
        name: team2Name,
        players: team2PlayersData
      }
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'batsman': return 'bg-blue-100 text-blue-800';
      case 'bowler': return 'bg-red-100 text-red-800';
      case 'all-rounder': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'captain': return '👑';
      case 'wicket-keeper': return '🧤';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200">
          <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white p-6 rounded-t-xl">
            <h1 className="text-3xl font-bold text-center">IPL Match Setup</h1>
            <p className="text-center text-blue-100 mt-2">Configure teams and players for the match</p>
          </div>
          
          <div className="p-8">
            {/* Match Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 border-b border-blue-200 pb-2">Match Details</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Stadium</label>
                  <Input
                    value={stadium}
                    onChange={(e) => setStadium(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Total Overs</label>
                  <Input
                    type="number"
                    value={totalOvers}
                    onChange={(e) => setTotalOvers(parseInt(e.target.value) || 20)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Team 1</label>
                  <Input
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Team 2</label>
                  <Input
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Toss Winner</label>
                  <select 
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value)}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-blue-200"
                  >
                    <option value={team1Name}>{team1Name}</option>
                    <option value={team2Name}>{team2Name}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Teams and Players */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              {/* Team 1 Players */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  {team1Name} Players
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {team1Players.map((player, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{index + 1}</span>
                        <span className="text-lg">{getRoleIcon(player.role)}</span>
                        <Input
                          value={player.name}
                          onChange={(e) => handlePlayerChange(1, index, 'name', e.target.value)}
                          className="flex-1 border-blue-200 focus:border-blue-500"
                          placeholder={`Player ${index + 1} name`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={player.type}
                          onChange={(e) => handlePlayerChange(1, index, 'type', e.target.value)}
                          className="p-2 text-xs border border-blue-200 rounded focus:border-blue-500"
                        >
                          <option value="batsman">Batsman</option>
                          <option value="bowler">Bowler</option>
                          <option value="all-rounder">All-rounder</option>
                        </select>
                        <select
                          value={player.role}
                          onChange={(e) => handlePlayerChange(1, index, 'role', e.target.value)}
                          className="p-2 text-xs border border-blue-200 rounded focus:border-blue-500"
                        >
                          <option value="player">Player</option>
                          <option value="wicket-keeper">Wicket-keeper</option>
                          <option value="captain">Captain</option>
                        </select>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(player.type)}`}>
                          {player.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team 2 Players */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                  {team2Name} Players
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {team2Players.map((player, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-yellow-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{index + 1}</span>
                        <span className="text-lg">{getRoleIcon(player.role)}</span>
                        <Input
                          value={player.name}
                          onChange={(e) => handlePlayerChange(2, index, 'name', e.target.value)}
                          className="flex-1 border-yellow-200 focus:border-yellow-500"
                          placeholder={`Player ${index + 1} name`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={player.type}
                          onChange={(e) => handlePlayerChange(2, index, 'type', e.target.value)}
                          className="p-2 text-xs border border-yellow-200 rounded focus:border-yellow-500"
                        >
                          <option value="batsman">Batsman</option>
                          <option value="bowler">Bowler</option>
                          <option value="all-rounder">All-rounder</option>
                        </select>
                        <select
                          value={player.role}
                          onChange={(e) => handlePlayerChange(2, index, 'role', e.target.value)}
                          className="p-2 text-xs border border-yellow-200 rounded focus:border-yellow-500"
                        >
                          <option value="player">Player</option>
                          <option value="wicket-keeper">Wicket-keeper</option>
                          <option value="captain">Captain</option>
                        </select>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(player.type)}`}>
                          {player.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleSubmit}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-3 text-lg font-semibold shadow-lg"
              >
                Start IPL Match
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSetup;
