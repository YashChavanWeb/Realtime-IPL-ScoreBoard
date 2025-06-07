
import { useCricket } from "../context/CricketContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const PublicScoreboard = () => {
  const { state } = useCricket();
  const { match } = state;
  const battingTeam = match[match.battingTeam];
  const striker = battingTeam.players.find(p => p.isOnStrike && p.isBatting);
  const nonStriker = battingTeam.players.find(p => !p.isOnStrike && p.isBatting);
  
  const runRate = battingTeam.overs > 0 || battingTeam.balls > 0 
    ? (battingTeam.totalRuns / ((battingTeam.overs * 6 + battingTeam.balls) / 6)).toFixed(2)
    : "0.00";

  return (
    <div className="w-full bg-gradient-to-r from-green-800 to-green-900 text-white p-6 shadow-xl">
      <div className="max-w-7xl mx-auto">
        {/* Stadium and Match Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{match.stadium}</h1>
          <div className="text-xl">
            {match.team1.name} vs {match.team2.name}
          </div>
          <div className="text-sm opacity-80 mt-1">
            Toss: {match.tossWinner} • {match.totalOvers} Overs Match
          </div>
        </div>

        {/* Main Score Display */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Team Score */}
              <div className="text-center md:text-left">
                <div className="text-sm opacity-80 mb-1">
                  {battingTeam.name} {match.battingTeam === 'team1' ? '(Batting)' : '(Batting)'}
                </div>
                <div className="text-5xl font-bold">
                  {battingTeam.totalRuns}
                  <span className="text-3xl">/{battingTeam.wickets}</span>
                </div>
                <div className="text-xl mt-2">
                  ({battingTeam.overs}.{battingTeam.balls} Overs)
                </div>
                <div className="text-sm opacity-80 mt-1">
                  Run Rate: {runRate}
                </div>
              </div>

              {/* Current Batsmen */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm opacity-80 mb-3">Current Partnership</div>
                  {striker && (
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-yellow-500 text-black">
                        ★
                      </Badge>
                      <div className="text-lg">
                        <span className="font-semibold">{striker.name}</span>
                        <div className="text-sm opacity-80">
                          {striker.runs} ({striker.balls}) 
                          {striker.fours > 0 && ` • ${striker.fours}×4`}
                          {striker.sixes > 0 && ` • ${striker.sixes}×6`}
                        </div>
                      </div>
                    </div>
                  )}
                  {nonStriker && (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6"></div>
                      <div className="text-lg">
                        <span className="font-semibold">{nonStriker.name}</span>
                        <div className="text-sm opacity-80">
                          {nonStriker.runs} ({nonStriker.balls})
                          {nonStriker.fours > 0 && ` • ${nonStriker.fours}×4`}
                          {nonStriker.sixes > 0 && ` • ${nonStriker.sixes}×6`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bowling Info */}
              <div className="text-center md:text-right">
                <div className="text-sm opacity-80 mb-1">Current Bowler</div>
                <div className="text-xl font-semibold mb-2">{match.currentBowler}</div>
                <div className="text-sm">
                  {battingTeam.overs}.{battingTeam.balls} Balls
                </div>
                {state.isFreeHit && (
                  <Badge className="mt-2 bg-red-500 text-white">
                    FREE HIT
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Extras and Additional Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="opacity-80">Extras</div>
            <div className="font-semibold">
              {Object.values(battingTeam.extras).reduce((a, b) => a + b, 0)}
            </div>
          </div>
          <div>
            <div className="opacity-80">Wides</div>
            <div className="font-semibold">{battingTeam.extras.wides}</div>
          </div>
          <div>
            <div className="opacity-80">No Balls</div>
            <div className="font-semibold">{battingTeam.extras.noBalls}</div>
          </div>
          <div>
            <div className="opacity-80">Byes + LB</div>
            <div className="font-semibold">
              {battingTeam.extras.byes + battingTeam.extras.legByes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicScoreboard;
