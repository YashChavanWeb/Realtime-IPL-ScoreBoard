import { useState } from "react";
import { useCricket } from "../context/CricketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "../context/CricketContext";
import { useNavigate } from "react-router-dom";

const MatchSetupPage = () => {
  const { dispatch } = useCricket();
  const navigate = useNavigate();
  
  // Pre-filled match data
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

    navigate('/');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'batsman': return 'bg-blue-500';
      case 'bowler': return 'bg-red-500';
      case 'all-rounder': return 'bg-green-500';
      default: return 'bg-gray-500';
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto p-6">
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardTitle className="text-3xl font-bold text-center">IPL Match Setup</CardTitle>
            <p className="text-center text-primary-foreground/80 mt-2">Configure teams and players for the match</p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Match Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Match Details</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Stadium</label>
                  <Input
                    value={stadium}
                    onChange={(e) => setStadium(e.target.value)}
                    className="border-input focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Total Overs</label>
                  <Input
                    type="number"
                    value={totalOvers}
                    onChange={(e) => setTotalOvers(parseInt(e.target.value) || 20)}
                    className="border-input focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Team 1</label>
                  <Input
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="border-input focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Team 2</label>
                  <Input
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="border-input focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Toss Winner</label>
                  <select 
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value)}
                    className="w-full p-3 border border-input rounded-lg focus:border-primary focus:ring-primary/20 bg-background"
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
              <Card className="border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    {team1Name} Players
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {team1Players.map((player, index) => (
                      <Card key={index} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="text-lg">{getRoleIcon(player.role)}</span>
                            <Input
                              value={player.name}
                              onChange={(e) => handlePlayerChange(1, index, 'name', e.target.value)}
                              className="flex-1 border-input focus:border-primary"
                              placeholder={`Player ${index + 1} name`}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <select
                              value={player.type}
                              onChange={(e) => handlePlayerChange(1, index, 'type', e.target.value)}
                              className="p-2 text-xs border border-input rounded focus:border-primary bg-background"
                            >
                              <option value="batsman">Batsman</option>
                              <option value="bowler">Bowler</option>
                              <option value="all-rounder">All-rounder</option>
                            </select>
                            <select
                              value={player.role}
                              onChange={(e) => handlePlayerChange(1, index, 'role', e.target.value)}
                              className="p-2 text-xs border border-input rounded focus:border-primary bg-background"
                            >
                              <option value="player">Player</option>
                              <option value="wicket-keeper">Wicket-keeper</option>
                              <option value="captain">Captain</option>
                            </select>
                          </div>
                          <Badge className={`${getTypeColor(player.type)} text-white`}>
                            {player.type}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team 2 Players */}
              <Card className="border-secondary/20">
                <CardHeader className="bg-secondary/5">
                  <CardTitle className="text-lg text-secondary-foreground flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary rounded-full"></div>
                    {team2Name} Players
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {team2Players.map((player, index) => (
                      <Card key={index} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="text-lg">{getRoleIcon(player.role)}</span>
                            <Input
                              value={player.name}
                              onChange={(e) => handlePlayerChange(2, index, 'name', e.target.value)}
                              className="flex-1 border-input focus:border-primary"
                              placeholder={`Player ${index + 1} name`}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <select
                              value={player.type}
                              onChange={(e) => handlePlayerChange(2, index, 'type', e.target.value)}
                              className="p-2 text-xs border border-input rounded focus:border-primary bg-background"
                            >
                              <option value="batsman">Batsman</option>
                              <option value="bowler">Bowler</option>
                              <option value="all-rounder">All-rounder</option>
                            </select>
                            <select
                              value={player.role}
                              onChange={(e) => handlePlayerChange(2, index, 'role', e.target.value)}
                              className="p-2 text-xs border border-input rounded focus:border-primary bg-background"
                            >
                              <option value="player">Player</option>
                              <option value="wicket-keeper">Wicket-keeper</option>
                              <option value="captain">Captain</option>
                            </select>
                          </div>
                          <Badge className={`${getTypeColor(player.type)} text-white`}>
                            {player.type}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleSubmit}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-12 py-3 text-lg font-semibold shadow-lg"
              >
                Start IPL Match
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchSetupPage;