
import { useState } from "react";
import { useCricket } from "../context/CricketContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const { state, dispatch } = useCricket();
  const { match } = state;
  const [extraRuns, setExtraRuns] = useState(1);
  const [selectedWicketType, setSelectedWicketType] = useState('');
  
  const battingTeam = match[match.battingTeam];
  const bowlingTeam = match[match.bowlingTeam];
  
  const handleRunClick = (runs: number) => {
    dispatch({ type: 'ADD_RUNS', runs });
  };
  
  const handleExtra = (extraType: 'wide' | 'noBall' | 'bye' | 'legBye') => {
    dispatch({ type: 'ADD_EXTRA', extraType, runs: extraRuns });
  };
  
  const handleWicket = () => {
    if (selectedWicketType) {
      dispatch({ type: 'WICKET', wicketType: selectedWicketType });
      setSelectedWicketType('');
    }
  };

  const runRate = battingTeam.overs > 0 || battingTeam.balls > 0 
    ? (battingTeam.totalRuns / ((battingTeam.overs * 6 + battingTeam.balls) / 6)).toFixed(2)
    : "0.00";

  const requiredRate = match.totalOvers > 0 
    ? (((battingTeam.totalRuns + 1) / (match.totalOvers - battingTeam.overs - (battingTeam.balls / 6))).toFixed(2))
    : "0.00";

  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🏏 Admin Dashboard
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Details Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏟️ Match Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Stadium</label>
                <div className="text-lg">{match.stadium}</div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600">Teams</label>
                <div className="text-lg">{match.team1.name} vs {match.team2.name}</div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600">Toss Winner</label>
                <div className="text-lg">{match.tossWinner}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Batting</label>
                  <div className="text-lg text-green-600">{battingTeam.name}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Bowling</label>
                  <div className="text-lg text-blue-600">{bowlingTeam.name}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600">Match Format</label>
                <div className="text-lg">{match.totalOvers} Overs</div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Current Run Rate</div>
                <div className="text-xl font-bold text-green-600">{runRate}</div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Required Rate</div>
                <div className="text-xl font-bold text-orange-600">{requiredRate}</div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring System Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Scoring System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Run Buttons */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-3 block">Runs</label>
                <div className="grid grid-cols-6 gap-2">
                  {[0, 1, 2, 3, 4, 6].map((run) => (
                    <Button
                      key={run}
                      onClick={() => handleRunClick(run)}
                      variant={run === 4 ? "default" : run === 6 ? "default" : "outline"}
                      className={`h-12 text-lg font-bold ${
                        run === 4 ? "bg-green-600 hover:bg-green-700" : 
                        run === 6 ? "bg-red-600 hover:bg-red-700" : ""
                      }`}
                    >
                      {run}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Extras */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-3 block">Extras</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={extraRuns}
                      onChange={(e) => setExtraRuns(parseInt(e.target.value) || 1)}
                      className="w-16"
                      min="1"
                    />
                    <span className="text-sm">Extra Runs</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => handleExtra('wide')} 
                      variant="outline"
                      className="text-sm"
                    >
                      Wide
                    </Button>
                    <Button 
                      onClick={() => handleExtra('noBall')} 
                      variant="outline"
                      className="text-sm"
                    >
                      No Ball
                    </Button>
                    <Button 
                      onClick={() => handleExtra('bye')} 
                      variant="outline"
                      className="text-sm"
                    >
                      Bye
                    </Button>
                    <Button 
                      onClick={() => handleExtra('legBye')} 
                      variant="outline"
                      className="text-sm"
                    >
                      Leg Bye
                    </Button>
                  </div>
                </div>
              </div>

              {/* Wickets */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-3 block">Wicket</label>
                <div className="space-y-3">
                  <Select value={selectedWicketType} onValueChange={setSelectedWicketType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wicket type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caught">Caught</SelectItem>
                      <SelectItem value="bowled">Bowled</SelectItem>
                      <SelectItem value="lbw">LBW</SelectItem>
                      <SelectItem value="runout">Run Out</SelectItem>
                      <SelectItem value="stumped">Stumped</SelectItem>
                      <SelectItem value="hitwicket">Hit Wicket</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleWicket} 
                    variant="destructive" 
                    className="w-full"
                    disabled={!selectedWicketType}
                  >
                    Record Wicket
                  </Button>
                </div>
              </div>

              {/* Strike Control */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-3 block">Strike Control</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Switch Strike</span>
                  <Button 
                    onClick={() => dispatch({ type: 'SWITCH_STRIKE' })}
                    variant="outline"
                    size="sm"
                  >
                    Switch
                  </Button>
                </div>
              </div>

              {/* Match Status */}
              <div className="space-y-2">
                {state.isFreeHit && (
                  <Badge className="w-full justify-center bg-red-500 text-white">
                    FREE HIT ACTIVE
                  </Badge>
                )}
                
                <Button
                  onClick={() => dispatch({ type: 'SET_FREE_HIT', value: !state.isFreeHit })}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {state.isFreeHit ? 'End Free Hit' : 'Set Free Hit'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team and Player Details Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 Team & Players
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Batting Team */}
              <div>
                <h4 className="font-semibold text-green-600 mb-3">
                  {battingTeam.name} (Batting)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {battingTeam.players.map((player) => (
                    <div 
                      key={player.id} 
                      className={`p-2 rounded-lg border ${
                        player.isBatting ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {player.isOnStrike && (
                            <Badge variant="secondary" className="bg-yellow-500 text-black text-xs">
                              ★
                            </Badge>
                          )}
                          <span className={`text-sm ${player.isOut ? 'line-through text-gray-500' : ''}`}>
                            {player.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {player.runs}({player.balls})
                          {player.isOut && (
                            <div className="text-red-500">{player.howOut}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bowling Team */}
              <div>
                <h4 className="font-semibold text-blue-600 mb-3">
                  {bowlingTeam.name} (Bowling)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {bowlingTeam.players.map((player) => (
                    <div 
                      key={player.id} 
                      className={`p-2 rounded-lg border ${
                        player.name === match.currentBowler ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {player.name === match.currentBowler && (
                            <Badge variant="secondary" className="bg-blue-500 text-white text-xs">
                              🎯
                            </Badge>
                          )}
                          <span className="text-sm">{player.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dispatch({ type: 'UPDATE_BOWLER', bowler: player.name })}
                          className="text-xs h-6"
                        >
                          Bowl
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Update Players
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
