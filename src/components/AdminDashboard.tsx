import { useState } from "react";
import { useCricket } from "../context/CricketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
  const { state, dispatch } = useCricket();
  const { match } = state;
  const [extraRuns, setExtraRuns] = useState(1);
  const [selectedWicketType, setSelectedWicketType] = useState('');
  const [wicketTaker, setWicketTaker] = useState('');
  const [newBowler, setNewBowler] = useState('');
  
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
      dispatch({ type: 'WICKET', wicketType: selectedWicketType, fielder: wicketTaker });
      setSelectedWicketType('');
      setWicketTaker('');
    }
  };

  const handleStartInnings = (innings: 1 | 2) => {
    dispatch({ type: 'START_INNINGS', innings });
  };

  const handleEndInnings = () => {
    dispatch({ type: 'END_INNINGS' });
  };

  const handleUpdateBowler = () => {
    if (newBowler.trim()) {
      dispatch({ type: 'UPDATE_BOWLER', bowler: newBowler });
      setNewBowler('');
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
          
          {/* Innings Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleStartInnings(1)}
              disabled={match.isMatchActive && match.currentInnings === 1}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Innings 1
            </Button>
            <Button
              onClick={() => handleStartInnings(2)}
              disabled={match.isMatchActive && match.currentInnings === 2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Innings 2
            </Button>
            <Button
              onClick={handleEndInnings}
              disabled={!match.isMatchActive}
              variant="destructive"
            >
              End Innings
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Match Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 text-primary">Match Details</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Stadium:</span>
                  <div className="border border-primary/20 rounded px-3 py-2 mt-1 bg-gray-50">
                    {match.stadium || 'Not set'}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Innings:</span>
                  <div className="text-lg font-bold text-primary">{match.currentInnings}/2</div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Overs: {match.totalOvers}/50
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="border border-primary/20 rounded px-3 py-2 flex-1 text-center bg-green-50">
                    {match.team1.name || 'Team 1'}
                  </div>
                  <span className="font-bold text-primary">vs</span>
                  <div className="border border-primary/20 rounded px-3 py-2 flex-1 text-center bg-blue-50">
                    {match.team2.name || 'Team 2'}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Toss won by:</span>
                  <div className="border border-primary/20 rounded px-3 py-2 mt-1 bg-yellow-50">
                    {match.tossWinner || 'Not set'}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Batting Team:</span>
                  <div className="mt-1 font-semibold text-primary">{battingTeam.name}</div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Bowling team:</span>
                  <div className="mt-1 font-semibold text-primary">{bowlingTeam.name}</div>
                </div>

                {/* Bowler Update */}
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Current Bowler:</span>
                  <div className="mt-1 font-semibold text-primary">{match.currentBowler || 'Not set'}</div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="New bowler name"
                      value={newBowler}
                      onChange={(e) => setNewBowler(e.target.value)}
                      className="border-primary/20 focus:border-primary"
                    />
                    <Button onClick={handleUpdateBowler} size="sm" className="bg-primary">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scoring System */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Scoring System:</h3>
              
              <div className="border border-primary/20 rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
                {/* Runs */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2 font-medium text-primary">Runs:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                      <Button
                        key={run}
                        onClick={() => handleRunClick(run)}
                        disabled={!match.isMatchActive}
                        className={`${
                          run === 0 ? 'bg-gray-500 hover:bg-gray-600' :
                          run === 4 ? 'bg-green-600 hover:bg-green-700' :
                          run === 6 ? 'bg-purple-600 hover:bg-purple-700' :
                          'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                      >
                        {run}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2 font-medium text-primary">Extras:</h4>
                  <div className="flex gap-2 mb-2">
                    <Button 
                      onClick={() => handleExtra('wide')} 
                      disabled={!match.isMatchActive}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                    >
                      Wide
                    </Button>
                    <Button 
                      onClick={() => handleExtra('noBall')} 
                      disabled={!match.isMatchActive}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                    >
                      No ball
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Runs:</span>
                    <Input
                      type="number"
                      value={extraRuns}
                      onChange={(e) => setExtraRuns(parseInt(e.target.value) || 1)}
                      className="w-16 h-8 border-primary/20 focus:border-primary"
                      min="1"
                    />
                  </div>
                </div>

                {/* Wicket */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2 font-medium text-primary">Wicket:</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium">Type:</span>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {['Catch-out', 'Run-out', 'Bowled', 'Hit-wicket', 'LBW', 'Stump-out'].map((type) => (
                          <Button
                            key={type}
                            onClick={() => setSelectedWicketType(type)}
                            variant={selectedWicketType === type ? "default" : "outline"}
                            className={`text-xs h-8 ${
                              selectedWicketType === type 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'border-primary/20 text-primary hover:bg-primary/10'
                            }`}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium">Taker:</span>
                      <Input
                        placeholder="player-name"
                        value={wicketTaker}
                        onChange={(e) => setWicketTaker(e.target.value)}
                        className="mt-1 h-8 border-primary/20 focus:border-primary"
                      />
                    </div>
                    <Button 
                      onClick={handleWicket} 
                      disabled={!selectedWicketType || !match.isMatchActive}
                      className="w-full h-8 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Record Wicket
                    </Button>
                  </div>
                </div>

                {/* On-strike */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2 font-medium text-primary">on-strike:</h4>
                  <div className="border border-primary/20 rounded px-3 py-2 mb-2 bg-white">
                    {battingTeam.players.find(p => p.isOnStrike)?.name || 'No striker'}
                  </div>
                  <Button 
                    onClick={() => dispatch({ type: 'SWITCH_STRIKE' })}
                    disabled={!match.isMatchActive}
                    className="w-full h-8 bg-primary hover:bg-primary/90"
                  >
                    Switch
                  </Button>
                </div>

                {/* Other Details */}
                <div>
                  <h4 className="text-sm mb-2 font-medium text-primary">Other Details:</h4>
                  <div className="space-y-1">
                    <Button 
                      variant="outline" 
                      className="w-full h-8 border-primary/20 text-primary hover:bg-primary/10 text-xs"
                    >
                      Show Run rate
                    </Button>
                    <Button 
                      onClick={() => dispatch({ type: 'SET_FREE_HIT', value: !state.isFreeHit })}
                      className={`w-full h-8 text-xs ${
                        state.isFreeHit 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      Free Hit {state.isFreeHit ? '(Active)' : ''}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-8 border-primary/20 text-primary hover:bg-primary/10 text-xs"
                    >
                      Needed Runs
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team and Player Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Team and Player Details</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Team1 */}
                <div className="border border-primary/20 rounded-lg p-3 bg-gradient-to-br from-green-50 to-green-100">
                  <h4 className="text-center mb-2 font-semibold text-primary">{match.team1.name || 'Team1'}</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {match.team1.players.slice(0, 6).map((player, index) => (
                      <div key={player.id} className="flex items-center gap-1 text-xs">
                        <span className="w-4 text-center font-medium">{index + 1}</span>
                        <div className={`w-4 h-4 rounded-full ${player.isBatting ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="flex-1 text-xs truncate font-medium">{player.name}</span>
                        <span className="text-xs">{player.runs}({player.balls})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team2 */}
                <div className="border border-primary/20 rounded-lg p-3 bg-gradient-to-br from-blue-50 to-blue-100">
                  <h4 className="text-center mb-2 font-semibold text-primary">{match.team2.name || 'Team2'}</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {match.team2.players.slice(0, 6).map((player, index) => (
                      <div key={player.id} className="flex items-center gap-1 text-xs">
                        <span className="w-4 text-center font-medium">{index + 1}</span>
                        <div className={`w-4 h-4 rounded-full ${player.isBatting ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className="flex-1 text-xs truncate font-medium">{player.name}</span>
                        <span className="text-xs">{player.runs}({player.balls})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-primary/20 text-primary hover:bg-primary/10"
              >
                Update Players
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
