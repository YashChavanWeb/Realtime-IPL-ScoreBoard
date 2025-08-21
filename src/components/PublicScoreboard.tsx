
import { useCricket } from "../context/CricketContext";

const PublicScoreboard = () => {
  const { state } = useCricket();
  const { match } = state;
  const battingTeam = match[match.battingTeam];
  const striker = battingTeam.players.find(p => p.isOnStrike && p.isBatting);
  const nonStriker = battingTeam.players.find(p => !p.isOnStrike && p.isBatting);

  const getBallStyle = (outcome: string) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200";
    
    switch (outcome) {
      case '0': return `${baseClasses} ball-dot`;
      case '1': return `${baseClasses} ball-single`;
      case '2': return `${baseClasses} ball-double`;
      case '3': return `${baseClasses} ball-triple`;
      case '4': return `${baseClasses} ball-four`;
      case '6': return `${baseClasses} ball-six`;
      case 'W': return `${baseClasses} ball-wicket`;
      case 'Wd': return `${baseClasses} ball-wide`;
      case 'Nb': return `${baseClasses} ball-noball`;
      case 'B': case 'Lb': return `${baseClasses} ball-bye`;
      default: return `${baseClasses} bg-white border-gray-300 text-gray-400`;
    }
  };

  const getBallDisplay = (outcome: string) => {
    switch (outcome) {
      case 'Wd': return 'W';
      case 'Nb': return 'N';
      case 'B': return 'B';
      case 'Lb': return 'L';
      default: return outcome;
    }
  };

  // Pad current over balls to show 6 balls
  const currentOverDisplay = [...(match.currentOverBalls || [])];
  while (currentOverDisplay.length < 6) {
    currentOverDisplay.push({ outcome: '' } as any);
  }

  const getPlayerIcon = (player: any) => {
    if (!player) return '';
    if (player.role === 'captain') return '👑';
    if (player.role === 'wicket-keeper') return '🧤';
    return '';
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              IPL Live Scoreboard
            </h1>
            <div className="text-blue-200 text-lg">
              {match.stadium} • Innings {match.currentInnings}/2
            </div>
          </div>
          <div className="flex gap-2">
            <a 
              href="/setup" 
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Setup
            </a>
            <a 
              href="/analytics" 
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Analytics
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          {/* Batting Team Info */}
          <div className="professional-card text-blue-900 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-sm font-medium mb-1">Batting</div>
              <div className="text-lg font-bold">{battingTeam.name}</div>
            </div>
          </div>

          {/* Main Score */}
          <div className="lg:col-span-2 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="professional-card text-blue-900 px-8 py-4 rounded-xl">
                <div className="text-4xl font-bold">{battingTeam.totalRuns}</div>
                <div className="text-sm">Runs</div>
              </div>
              <div className="text-3xl text-blue-200">-</div>
              <div className="professional-card text-blue-900 px-8 py-4 rounded-xl">
                <div className="text-4xl font-bold">{battingTeam.wickets}</div>
                <div className="text-sm">Wickets</div>
              </div>
            </div>
            
            <div className="professional-card text-blue-900 p-3 rounded-xl inline-block">
              <div className="text-2xl font-bold">{battingTeam.overs}.{battingTeam.balls}</div>
              <div className="text-sm">Overs</div>
            </div>
          </div>

          {/* Current Over */}
          <div className="lg:col-span-2">
            <div className="professional-card text-blue-900 p-4 rounded-xl">
              <div className="text-center mb-3">
                <div className="text-lg font-bold">This Over</div>
                <div className="text-sm text-blue-600">Over {battingTeam.overs + 1}</div>
              </div>
              <div className="flex justify-center gap-2 mb-3">
                {currentOverDisplay.map((ball, i) => (
                  <div key={i} className={getBallStyle(ball.outcome || '')}>
                    {getBallDisplay(ball.outcome || '')}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Bowler</div>
                <div className="font-bold text-blue-700">{match.currentBowler || 'Not Set'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Batsmen Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="professional-card text-blue-900 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {striker?.isOnStrike && (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
                <span className="text-lg">{getPlayerIcon(striker)}</span>
                <span className="font-semibold">{striker?.name || 'Batsman 1'}</span>
                {striker?.isOnStrike && <span className="text-green-600 text-sm font-bold">*</span>}
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{striker?.runs || 0}({striker?.balls || 0})</div>
                <div className="text-sm text-blue-600">
                  {striker?.fours || 0}×4s, {striker?.sixes || 0}×6s
                </div>
              </div>
            </div>
          </div>

          <div className="professional-card text-blue-900 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {nonStriker && !nonStriker.isOnStrike && (
                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>
                )}
                <span className="text-lg">{getPlayerIcon(nonStriker)}</span>
                <span className="font-semibold">{nonStriker?.name || 'Batsman 2'}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{nonStriker?.runs || 0}({nonStriker?.balls || 0})</div>
                <div className="text-sm text-blue-600">
                  {nonStriker?.fours || 0}×4s, {nonStriker?.sixes || 0}×6s
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Status */}
        {state.isFreeHit && (
          <div className="mt-4 text-center">
            <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
              🎯 FREE HIT
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicScoreboard;
