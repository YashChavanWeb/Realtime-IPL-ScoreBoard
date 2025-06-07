
import { useCricket } from "../context/CricketContext";

const PublicScoreboard = () => {
  const { state } = useCricket();
  const { match } = state;
  const battingTeam = match[match.battingTeam];
  const striker = battingTeam.players.find(p => p.isOnStrike && p.isBatting);
  const nonStriker = battingTeam.players.find(p => !p.isOnStrike && p.isBatting);

  const getBallColor = (outcome: string) => {
    switch (outcome) {
      case '0': return 'bg-gray-100 text-gray-800';
      case '1': case '2': case '3': return 'bg-blue-100 text-blue-800';
      case '4': return 'bg-green-100 text-green-800';
      case '6': return 'bg-purple-100 text-purple-800';
      case 'W': return 'bg-red-100 text-red-800';
      case 'Wd': return 'bg-yellow-100 text-yellow-800';
      case 'Nb': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-50 border border-gray-300';
    }
  };

  // Pad current over balls to show 6 balls
  const currentOverDisplay = [...match.currentOverBalls];
  while (currentOverDisplay.length < 6) {
    currentOverDisplay.push({ outcome: '' } as any);
  }

  return (
    <div className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Public Score Board - Innings {match.currentInnings}
        </h1>
        
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* Batting Team */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
            <span className="text-lg font-semibold text-white">bat-team</span>
            <div className="text-sm mt-1 text-white/90">{battingTeam.name}</div>
          </div>

          {/* Runs - Wickets */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-2">
              <span className="text-2xl font-bold text-white">{battingTeam.totalRuns}</span>
            </div>
            <span className="text-2xl text-white">-</span>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-2">
              <span className="text-2xl font-bold text-white">{battingTeam.wickets}</span>
            </div>
          </div>

          {/* Overs */}
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-2">
              <span className="text-xl font-bold text-white">{battingTeam.overs}.{battingTeam.balls}</span>
            </div>
            <div className="text-sm text-white/90">overs</div>
          </div>

          {/* Players */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              {striker?.isOnStrike && (
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
              <span className="text-white">{striker?.name || 'Player 1'}</span>
              <span className="ml-auto text-white">{striker?.runs || 0} ({striker?.balls || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              {nonStriker && !nonStriker.isOnStrike && (
                <div className="w-3 h-3 border border-white/50 rounded-full"></div>
              )}
              <span className="text-white">{nonStriker?.name || 'Player 2'}</span>
              <span className="ml-auto text-white">{nonStriker?.runs || 0} ({nonStriker?.balls || 0})</span>
            </div>
          </div>

          {/* Bowler and Balls */}
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <div className="text-sm mb-1 text-white/90">Bowler</div>
              <div className="font-semibold text-white">{match.currentBowler || 'Select Bowler'}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-2">{battingTeam.overs}.{battingTeam.balls}</div>
              <div className="flex gap-1 mb-2">
                {currentOverDisplay.map((ball, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/30 ${
                      ball.outcome ? getBallColor(ball.outcome) : 'bg-white/10'
                    }`}
                  >
                    {ball.outcome || ''}
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/90">This Over</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicScoreboard;
