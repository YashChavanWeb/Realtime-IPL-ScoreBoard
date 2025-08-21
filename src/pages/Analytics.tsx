import { useCricket } from "../context/CricketContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const { state } = useCricket();
  const navigate = useNavigate();
  
  if (!state.isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold text-foreground mb-4">No Match Data Available</h2>
            <p className="text-muted-foreground mb-4">Please set up a match first to view analytics.</p>
            <Button onClick={() => navigate('/setup')}>Setup Match</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { match } = state;
  const ballEvents = match.ballByBall;
  const currentBattingTeam = match.battingTeam === 'team1' ? match.team1 : match.team2;
  const currentBowlingTeam = match.battingTeam === 'team1' ? match.team2 : match.team1;

  // Calculate analytics data
  const getPlayerStats = () => {
    const allPlayers = [...match.team1.players, ...match.team2.players];
    return allPlayers.map(player => {
      const playerBalls = ballEvents.filter(ball => ball.batter === player.name);
      const runsPerOver = Array.from({length: match.totalOvers}, (_, i) => {
        const overBalls = playerBalls.filter(ball => ball.over === i + 1);
        return {
          over: i + 1,
          runs: overBalls.reduce((sum, ball) => sum + ball.runs, 0)
        };
      });

      const shotTypes = {
        dots: playerBalls.filter(ball => ball.runs === 0).length,
        singles: playerBalls.filter(ball => ball.runs === 1).length,
        twos: playerBalls.filter(ball => ball.runs === 2).length,
        threes: playerBalls.filter(ball => ball.runs === 3).length,
        fours: playerBalls.filter(ball => ball.runs === 4).length,
        sixes: playerBalls.filter(ball => ball.runs === 6).length,
      };

      return {
        ...player,
        runsPerOver,
        shotTypes,
        strikeRate: player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(1) : '0.0'
      };
    });
  };

  const getBowlerStats = () => {
    const allPlayers = [...match.team1.players, ...match.team2.players];
    return allPlayers
      .filter(player => player.type === 'bowler' || player.type === 'all-rounder')
      .map(bowler => {
        const bowlerBalls = ballEvents.filter(ball => ball.bowler === bowler.name);
        const runsGiven = bowlerBalls.reduce((sum, ball) => sum + ball.runs, 0);
        const wickets = bowlerBalls.filter(ball => ball.wicket).length;
        const oversBowled = Math.floor(bowlerBalls.length / 6) + (bowlerBalls.length % 6) / 10;
        const economy = oversBowled > 0 ? (runsGiven / oversBowled).toFixed(1) : '0.0';

        return {
          ...bowler,
          runsGiven,
          wickets,
          oversBowled: oversBowled.toFixed(1),
          economy,
          ballsBowled: bowlerBalls.length
        };
      });
  };

  const playerStats = getPlayerStats();
  const bowlerStats = getBowlerStats();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8', '#82ca9d'];

  const runRateData = ballEvents.reduce((acc, ball, index) => {
    const totalRuns = ballEvents.slice(0, index + 1).reduce((sum, b) => sum + b.runs, 0);
    const totalBalls = index + 1;
    const runRate = (totalRuns / totalBalls) * 6;
    
    return [...acc, {
      ball: index + 1,
      runRate: runRate.toFixed(1),
      cumulativeRuns: totalRuns
    }];
  }, [] as any[]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Match
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Match Analytics</h1>
        </div>

        {/* Match Summary */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Match Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Stadium</p>
                <p className="font-semibold text-foreground">{match.stadium}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Score</p>
                <p className="font-semibold text-foreground">
                  {currentBattingTeam.totalRuns}/{currentBattingTeam.wickets} 
                  ({currentBattingTeam.overs}.{currentBattingTeam.balls})
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Run Rate</p>
                <p className="font-semibold text-foreground">
                  {currentBattingTeam.overs > 0 || currentBattingTeam.balls > 0 
                    ? ((currentBattingTeam.totalRuns / ((currentBattingTeam.overs * 6 + currentBattingTeam.balls) / 6))).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Run Rate Chart */}
        {runRateData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Run Rate Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={runRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ball" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="runRate" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Batsman Analytics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Batsman Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {playerStats
                .filter(player => player.type === 'batsman' || player.type === 'all-rounder')
                .filter(player => player.balls > 0)
                .map((player, index) => (
                <Card key={player.id} className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{player.name}</span>
                      <Badge className={player.isOut ? 'bg-red-500' : 'bg-green-500'}>
                        {player.isOut ? 'Out' : 'Not Out'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Runs</p>
                        <p className="text-2xl font-bold text-primary">{player.runs}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Strike Rate</p>
                        <p className="text-2xl font-bold text-secondary">{player.strikeRate}</p>
                      </div>
                    </div>
                    
                    {/* Shot Distribution */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Shot Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Dots: {player.shotTypes.dots}</span>
                          <Progress value={(player.shotTypes.dots / player.balls) * 100} className="w-20 h-2" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">4s: {player.shotTypes.fours}</span>
                          <Progress value={(player.shotTypes.fours / player.balls) * 100} className="w-20 h-2" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">6s: {player.shotTypes.sixes}</span>
                          <Progress value={(player.shotTypes.sixes / player.balls) * 100} className="w-20 h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Runs per Over */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Runs per Over</h4>
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={player.runsPerOver.filter(over => over.runs > 0)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="over" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="runs" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bowler Analytics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bowler Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bowlerStats
                .filter(bowler => bowler.ballsBowled > 0)
                .map((bowler, index) => (
                <Card key={bowler.id} className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{bowler.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Overs</p>
                        <p className="text-xl font-bold text-primary">{bowler.oversBowled}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Wickets</p>
                        <p className="text-xl font-bold text-red-500">{bowler.wickets}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Economy</p>
                        <p className="text-xl font-bold text-secondary">{bowler.economy}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Runs Given</p>
                        <p className="text-lg font-semibold text-foreground">{bowler.runsGiven}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Balls Bowled</p>
                        <p className="text-lg font-semibold text-foreground">{bowler.ballsBowled}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Team Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">{match.team1.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Runs</span>
                    <span className="font-semibold">{match.team1.totalRuns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wickets</span>
                    <span className="font-semibold">{match.team1.wickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overs</span>
                    <span className="font-semibold">{match.team1.overs}.{match.team1.balls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extras</span>
                    <span className="font-semibold">
                      {match.team1.extras.wides + match.team1.extras.noBalls + match.team1.extras.byes + match.team1.extras.legByes}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">{match.team2.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Runs</span>
                    <span className="font-semibold">{match.team2.totalRuns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wickets</span>
                    <span className="font-semibold">{match.team2.wickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overs</span>
                    <span className="font-semibold">{match.team2.overs}.{match.team2.balls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extras</span>
                    <span className="font-semibold">
                      {match.team2.extras.wides + match.team2.extras.noBalls + match.team2.extras.byes + match.team2.extras.legByes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;