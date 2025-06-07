import { useState } from "react";
import { useCricket } from "../context/CricketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const { state, dispatch } = useCricket();
  const { match } = state;
  const [extraRuns, setExtraRuns] = useState(1);
  const [selectedWicketType, setSelectedWicketType] = useState('');
  const [wicketTaker, setWicketTaker] = useState('');
  
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

  return (
    <div className="w-full bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard:</h2>
        
        <div className="border-2 border-white rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Match Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Match Details</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm">Stadium:</span>
                  <div className="border border-white rounded px-3 py-1 mt-1">
                    {match.stadium}
                  </div>
                </div>
                
                <div className="text-sm">Overs: {match.totalOvers}/50</div>
                
                <div className="flex items-center gap-2">
                  <div className="border border-white rounded px-3 py-1 flex-1 text-center">
                    {match.team1.name}
                  </div>
                  <span>vs</span>
                  <div className="border border-white rounded px-3 py-1 flex-1 text-center">
                    {match.team2.name}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm">Toss won by:</span>
                  <div className="border border-white rounded px-3 py-1 mt-1">
                    {match.tossWinner}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm">Batting Team:</span>
                  <div className="mt-1">{battingTeam.name}</div>
                </div>
                
                <div>
                  <span className="text-sm">Bowling team:</span>
                  <div className="mt-1">{bowlingTeam.name}</div>
                </div>
              </div>
            </div>

            {/* Scoring System */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Scoring System:</h3>
              
              <div className="border border-white rounded-lg p-4">
                {/* Runs */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2">Runs:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                      <Button
                        key={run}
                        onClick={() => handleRunClick(run)}
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-black"
                      >
                        {run}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2">Extras:</h4>
                  <div className="flex gap-2 mb-2">
                    <Button 
                      onClick={() => handleExtra('wide')} 
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black text-xs"
                    >
                      Wide
                    </Button>
                    <Button 
                      onClick={() => handleExtra('noBall')} 
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black text-xs"
                    >
                      No ball
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Runs:</span>
                    <Input
                      type="number"
                      value={extraRuns}
                      onChange={(e) => setExtraRuns(parseInt(e.target.value) || 1)}
                      className="w-16 h-8 bg-black border-white text-white"
                      min="1"
                    />
                  </div>
                </div>

                {/* Wicket */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2">Wicket:</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs">Type:</span>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {['Catch-out', 'Run-out', 'Bowled', 'Hit-wicket', 'LBW', 'Stump-out'].map((type) => (
                          <Button
                            key={type}
                            onClick={() => setSelectedWicketType(type)}
                            variant={selectedWicketType === type ? "default" : "outline"}
                            className={`text-xs h-8 ${selectedWicketType === type ? 'bg-white text-black' : 'border-white text-white hover:bg-white hover:text-black'}`}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs">Taker:</span>
                      <Input
                        placeholder="player-name"
                        value={wicketTaker}
                        onChange={(e) => setWicketTaker(e.target.value)}
                        className="mt-1 h-8 bg-black border-white text-white placeholder-gray-400"
                      />
                    </div>
                    <Button 
                      onClick={handleWicket} 
                      disabled={!selectedWicketType}
                      className="w-full h-8 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Record Wicket
                    </Button>
                  </div>
                </div>

                {/* On-strike */}
                <div className="mb-4">
                  <h4 className="text-sm mb-2">on-strike:</h4>
                  <div className="border border-white rounded px-3 py-1 mb-2">
                    {battingTeam.players.find(p => p.isOnStrike)?.name || 'No striker'}
                  </div>
                  <Button 
                    onClick={() => dispatch({ type: 'SWITCH_STRIKE' })}
                    variant="outline"
                    className="w-full h-8 border-white text-white hover:bg-white hover:text-black"
                  >
                    Switch
                  </Button>
                </div>

                {/* Other Details */}
                <div>
                  <h4 className="text-sm mb-2">Other Details:</h4>
                  <div className="space-y-1">
                    <Button variant="outline" className="w-full h-8 border-white text-white hover:bg-white hover:text-black text-xs">
                      Show Run rate
                    </Button>
                    <Button 
                      onClick={() => dispatch({ type: 'SET_FREE_HIT', value: !state.isFreeHit })}
                      variant="outline" 
                      className={`w-full h-8 text-xs ${state.isFreeHit ? 'bg-red-500 text-white' : 'border-white text-white hover:bg-white hover:text-black'}`}
                    >
                      Free Hit
                    </Button>
                    <Button variant="outline" className="w-full h-8 border-white text-white hover:bg-white hover:text-black text-xs">
                      Needed Runs
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team and Player Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team and Player Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Team1 */}
                <div className="border border-white rounded-lg p-3">
                  <h4 className="text-center mb-2 font-semibold">Team1</h4>
                  <div className="space-y-2">
                    {match.team1.players.slice(0, 5).map((player, index) => (
                      <div key={player.id} className="flex items-center gap-1 text-xs">
                        <span className="w-4 text-center">{index + 1}</span>
                        <span className="w-4 text-center">{index + 2}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-6 h-6 p-0 border-white text-white hover:bg-white hover:text-black text-xs"
                        >
                          B
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-6 h-6 p-0 border-white text-white hover:bg-white hover:text-black text-xs"
                        >
                          F
                        </Button>
                        <span className="flex-1 text-xs truncate">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team2 */}
                <div className="border border-white rounded-lg p-3">
                  <h4 className="text-center mb-2 font-semibold">Team2</h4>
                  <div className="space-y-2">
                    {match.team2.players.slice(0, 5).map((player, index) => (
                      <div key={player.id} className="flex items-center gap-1 text-xs">
                        <span className="w-4 text-center">{index + 1}</span>
                        <span className="w-4 text-center">{index + 2}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-6 h-6 p-0 border-white text-white hover:bg-white hover:text-black text-xs"
                        >
                          B
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-6 h-6 p-0 border-white text-white hover:bg-white hover:text-black text-xs"
                        >
                          F
                        </Button>
                        <span className="flex-1 text-xs truncate">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-white text-white hover:bg-white hover:text-black"
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
