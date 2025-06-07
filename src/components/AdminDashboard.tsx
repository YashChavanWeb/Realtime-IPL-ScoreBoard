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

  const getPlayerIcon = (player: any) => {
    if (player.role === 'captain') return '👑';
    if (player.role === 'wicket-keeper') return '🧤';
    return '';
  };

  const getPlayerTypeColor = (type: string) => {
    switch (type) {
      case 'batsman': return 'bg-blue-100 text-blue-800';
      case 'bowler': return 'bg-red-100 text-red-800';
      case 'all-rounder': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white p-6 rounded-t-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <p className="text-blue-200">Control panel for live scoring</p>
            </div>
            
            {/* Innings Controls */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleStartInnings(1)}
                disabled={match.isMatchActive && match.currentInnings === 1}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Start Innings 1
              </Button>
              <Button
                onClick={() => handleStartInnings(2)}
                disabled={match.isMatchActive && match.currentInnings === 2}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Innings 2
              </Button>
              <Button
                onClick={handleEndInnings}
                disabled={!match.isMatchActive}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                End Innings
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-b-xl shadow-xl border-t-0">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-6">
            
            {/* Match Details Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-900 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  Match Details
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-sm font-medium text-slate-600">Stadium</span>
                    <div className="font-semibold text-slate-800">{match.stadium}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-blue-100 text-center">
                      <span className="text-sm font-medium text-slate-600">Innings</span>
                      <div className="text-2xl font-bold text-blue-600">{match.currentInnings}/2</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-100 text-center">
                      <span className="text-sm font-medium text-slate-600">Overs</span>
                      <div className="text-2xl font-bold text-blue-600">{match.totalOvers}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-3 border border-blue-200">
                      <span className="text-sm font-medium text-blue-700">Batting Team</span>
                      <div className="font-bold text-blue-900">{battingTeam.name}</div>
                    </div>
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg p-3 border border-slate-200">
                      <span className="text-sm font-medium text-slate-700">Bowling Team</span>
                      <div className="font-bold text-slate-900">{bowlingTeam.name}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-sm font-medium text-slate-600">Toss Winner</span>
                    <div className="font-semibold text-slate-800">{match.tossWinner}</div>
                  </div>

                  {/* Bowler Update */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <span className="text-sm font-medium text-yellow-800">Current Bowler</span>
                    <div className="font-bold text-yellow-900 mb-2">{match.currentBowler || 'Not set'}</div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="New bowler name"
                        value={newBowler}
                        onChange={(e) => setNewBowler(e.target.value)}
                        className="border-yellow-300 focus:border-yellow-500"
                      />
                      <Button onClick={handleUpdateBowler} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scoring System Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  Scoring System
                </h3>
                
                {/* Runs */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-green-800 mb-3">Runs</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                      <Button
                        key={run}
                        onClick={() => handleRunClick(run)}
                        disabled={!match.isMatchActive}
                        className={`h-14 text-lg font-bold ${
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
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-green-800 mb-3">Extras</h4>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button 
                      onClick={() => handleExtra('wide')} 
                      disabled={!match.isMatchActive}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white h-12"
                    >
                      Wide
                    </Button>
                    <Button 
                      onClick={() => handleExtra('noBall')} 
                      disabled={!match.isMatchActive}
                      className="bg-orange-600 hover:bg-orange-700 text-white h-12"
                    >
                      No Ball
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Extra Runs:</span>
                    <Input
                      type="number"
                      value={extraRuns}
                      onChange={(e) => setExtraRuns(parseInt(e.target.value) || 1)}
                      className="w-20 border-green-300 focus:border-green-500"
                      min="1"
                    />
                  </div>
                </div>

                {/* Wicket */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-green-800 mb-3">Wicket</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {['Bowled', 'Catch-out', 'LBW', 'Run-out', 'Hit-wicket', 'Stump-out'].map((type) => (
                        <Button
                          key={type}
                          onClick={() => setSelectedWicketType(type)}
                          variant={selectedWicketType === type ? "default" : "outline"}
                          className={`h-10 text-sm ${
                            selectedWicketType === type 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'border-red-300 text-red-700 hover:bg-red-50'
                          }`}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                    <Input
                      placeholder="Fielder/Bowler name"
                      value={wicketTaker}
                      onChange={(e) => setWicketTaker(e.target.value)}
                      className="border-red-300 focus:border-red-500"
                    />
                    <Button 
                      onClick={handleWicket} 
                      disabled={!selectedWicketType || !match.isMatchActive}
                      className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
                    >
                      Record Wicket
                    </Button>
                  </div>
                </div>

                {/* Other Controls */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => dispatch({ type: 'SWITCH_STRIKE' })}
                    disabled={!match.isMatchActive}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                  >
                    Switch Strike
                  </Button>
                  <Button 
                    onClick={() => dispatch({ type: 'SET_FREE_HIT', value: !state.isFreeHit })}
                    className={`w-full h-12 ${
                      state.isFreeHit 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {state.isFreeHit ? 'Cancel Free Hit' : 'Set Free Hit'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Team and Player Details Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  Team & Players
                </h3>
                
                <div className="space-y-4">
                  {/* Batting Team */}
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="text-center mb-3 font-bold text-blue-900">{match.team1.name}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {match.team1.players.slice(0, 8).map((player, index) => (
                        <div key={player.id} className="flex items-center gap-2 text-sm">
                          <span className="w-6 text-center font-medium text-blue-600">{index + 1}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            player.isBatting ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {player.isBatting ? '🏏' : ''}
                          </div>
                          <span className="text-sm">{getPlayerIcon(player)}</span>
                          <span className="flex-1 font-medium truncate">{player.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full font-medium {getPlayerTypeColor(player.type)}">
                            {player.type[0].toUpperCase()}
                          </span>
                          <span className="text-sm text-right">{player.runs}({player.balls})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bowling Team */}
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <h4 className="text-center mb-3 font-bold text-yellow-900">{match.team2.name}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {match.team2.players.slice(0, 8).map((player, index) => (
                        <div key={player.id} className="flex items-center gap-2 text-sm">
                          <span className="w-6 text-center font-medium text-yellow-600">{index + 1}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            player.name === match.currentBowler ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {player.name === match.currentBowler ? '⚾' : ''}
                          </div>
                          <span className="text-sm">{getPlayerIcon(player)}</span>
                          <span className="flex-1 font-medium truncate">{player.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full font-medium {getPlayerTypeColor(player.type)}">
                            {player.type[0].toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
