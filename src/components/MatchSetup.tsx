
import { useState } from "react";
import { useCricket } from "../context/CricketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Player } from "../context/CricketContext";

const MatchSetup = () => {
  const { dispatch } = useCricket();
  
  const [stadium, setStadium] = useState('');
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [totalOvers, setTotalOvers] = useState(20);
  
  const [team1Players, setTeam1Players] = useState<string[]>(Array(11).fill(''));
  const [team2Players, setTeam2Players] = useState<string[]>(Array(11).fill(''));

  const handlePlayerChange = (teamIndex: 1 | 2, playerIndex: number, name: string) => {
    if (teamIndex === 1) {
      const newPlayers = [...team1Players];
      newPlayers[playerIndex] = name;
      setTeam1Players(newPlayers);
    } else {
      const newPlayers = [...team2Players];
      newPlayers[playerIndex] = name;
      setTeam2Players(newPlayers);
    }
  };

  const handleSubmit = () => {
    const team1PlayersData: Player[] = team1Players
      .filter(name => name.trim())
      .map((name, index) => ({
        id: `team1_${index}`,
        name: name.trim(),
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        isBatting: false,
        isOnStrike: false
      }));

    const team2PlayersData: Player[] = team2Players
      .filter(name => name.trim())
      .map((name, index) => ({
        id: `team2_${index}`,
        name: name.trim(),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary text-center mb-8">Match Setup</h1>
          
          {/* Match Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Match Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Stadium</label>
                <Input
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  placeholder="Enter stadium name"
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Total Overs</label>
                <Input
                  type="number"
                  value={totalOvers}
                  onChange={(e) => setTotalOvers(parseInt(e.target.value) || 20)}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Team 1 Name</label>
                <Input
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Enter team 1 name"
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Team 2 Name</label>
                <Input
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Enter team 2 name"
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Toss Winner</label>
                <select 
                  value={tossWinner}
                  onChange={(e) => setTossWinner(e.target.value)}
                  className="w-full p-2 border border-primary/20 rounded-md focus:border-primary"
                >
                  <option value="">Select toss winner</option>
                  <option value={team1Name}>{team1Name || 'Team 1'}</option>
                  <option value={team2Name}>{team2Name || 'Team 2'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teams and Players */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Team 1 Players */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">{team1Name || 'Team 1'} Players</h3>
              <div className="space-y-3">
                {team1Players.map((player, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium text-muted-foreground">{index + 1}.</span>
                    <Input
                      value={player}
                      onChange={(e) => handlePlayerChange(1, index, e.target.value)}
                      placeholder={`Player ${index + 1} name`}
                      className="border-primary/20 focus:border-primary bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Team 2 Players */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">{team2Name || 'Team 2'} Players</h3>
              <div className="space-y-3">
                {team2Players.map((player, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium text-muted-foreground">{index + 1}.</span>
                    <Input
                      value={player}
                      onChange={(e) => handlePlayerChange(2, index, e.target.value)}
                      placeholder={`Player ${index + 1} name`}
                      className="border-primary/20 focus:border-primary bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleSubmit}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              disabled={!stadium || !team1Name || !team2Name || !tossWinner}
            >
              Start Match Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSetup;
