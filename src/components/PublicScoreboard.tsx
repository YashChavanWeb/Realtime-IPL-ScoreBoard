
import { useCricket } from "../context/CricketContext";
import { Badge } from "@/components/ui/badge";

const PublicScoreboard = () => {
  const { state } = useCricket();
  const { match } = state;
  const battingTeam = match[match.battingTeam];
  const striker = battingTeam.players.find(p => p.isOnStrike && p.isBatting);
  const nonStriker = battingTeam.players.find(p => !p.isOnStrike && p.isBatting);

  return (
    <div className="w-full bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Public Score Board:</h1>
        
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* Batting Team */}
          <div className="border-2 border-white rounded-lg px-4 py-2">
            <span className="text-lg font-semibold">bat-team</span>
            <div className="text-sm mt-1">{battingTeam.name}</div>
          </div>

          {/* Runs - Wickets */}
          <div className="flex items-center gap-2">
            <div className="border-2 border-white rounded-lg px-6 py-2">
              <span className="text-xl font-bold">{battingTeam.totalRuns}</span>
            </div>
            <span className="text-xl">-</span>
            <div className="border-2 border-white rounded-lg px-6 py-2">
              <span className="text-xl font-bold">{battingTeam.wickets}</span>
            </div>
          </div>

          {/* Overs */}
          <div className="text-center">
            <div className="border-2 border-white rounded-lg px-4 py-2 mb-2">
              <span className="text-xl font-bold">{battingTeam.overs}.{battingTeam.balls}</span>
            </div>
            <div className="text-sm">overs</div>
          </div>

          {/* Players */}
          <div className="border-2 border-white rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              {striker?.isOnStrike && (
                <div className="w-4 h-4 bg-white rounded-full"></div>
              )}
              <span>Player 1</span>
              <span className="ml-auto">{striker?.runs || 0} ({striker?.balls || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              {nonStriker && !nonStriker.isOnStrike && (
                <div className="w-4 h-4 border border-white rounded-full"></div>
              )}
              <span>Player 2</span>
              <span className="ml-auto">{nonStriker?.runs || 0} ({nonStriker?.balls || 0})</span>
            </div>
          </div>

          {/* Bowler and Balls */}
          <div className="flex items-center gap-4">
            <div className="border-2 border-white rounded-lg px-4 py-2">
              <div className="text-sm mb-1">Bowler Name</div>
              <div className="font-semibold">{match.currentBowler}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{battingTeam.overs}.{battingTeam.balls}</div>
              <div className="flex gap-1 mt-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-3 h-3 border border-white rounded"></div>
                ))}
              </div>
              <div className="text-sm mt-1">Balls</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicScoreboard;
