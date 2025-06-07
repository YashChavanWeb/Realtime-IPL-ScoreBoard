import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Player {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  howOut?: string;
  isBatting?: boolean;
  isOnStrike?: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };
}

export interface BallEvent {
  over: number;
  ball: number;
  runs: number;
  extras?: string;
  wicket?: boolean;
  batter: string;
  bowler: string;
  outcome: '0' | '1' | '2' | '3' | '4' | '6' | 'W' | 'Wd' | 'Nb' | 'B' | 'Lb';
}

export interface Match {
  id: string;
  stadium: string;
  team1: Team;
  team2: Team;
  battingTeam: 'team1' | 'team2';
  bowlingTeam: 'team1' | 'team2';
  tossWinner: string;
  totalOvers: number;
  currentBowler: string;
  isMatchActive: boolean;
  currentInnings: 1 | 2;
  ballByBall: BallEvent[];
  currentOverBalls: BallEvent[];
}

interface CricketState {
  match: Match;
  isFreeHit: boolean;
  isSetupComplete: boolean;
}

type CricketAction = 
  | { type: 'ADD_RUNS'; runs: number }
  | { type: 'ADD_EXTRA'; extraType: 'wide' | 'noBall' | 'bye' | 'legBye'; runs: number }
  | { type: 'WICKET'; wicketType: string; fielder?: string }
  | { type: 'SWITCH_STRIKE' }
  | { type: 'NEW_OVER' }
  | { type: 'UPDATE_BOWLER'; bowler: string }
  | { type: 'SET_FREE_HIT'; value: boolean }
  | { type: 'UPDATE_PLAYER'; teamId: 'team1' | 'team2'; playerId: string; updates: Partial<Player> }
  | { type: 'SETUP_MATCH'; matchData: Partial<Match> }
  | { type: 'START_INNINGS'; innings: 1 | 2 }
  | { type: 'END_INNINGS' }
  | { type: 'UPDATE_TEAMS'; team1: Partial<Team>; team2: Partial<Team> };

const initialState: CricketState = {
  match: {
    id: '1',
    stadium: '',
    team1: {
      id: 'team1',
      name: '',
      players: [],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    },
    team2: {
      id: 'team2',
      name: '',
      players: [],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    },
    battingTeam: 'team1',
    bowlingTeam: 'team2',
    tossWinner: '',
    totalOvers: 20,
    currentBowler: '',
    isMatchActive: false,
    currentInnings: 1,
    ballByBall: [],
    currentOverBalls: []
  },
  isFreeHit: false,
  isSetupComplete: false
};

function cricketReducer(state: CricketState, action: CricketAction): CricketState {
  switch (action.type) {
    case 'SETUP_MATCH': {
      return {
        ...state,
        match: { ...state.match, ...action.matchData },
        isSetupComplete: true
      };
    }

    case 'UPDATE_TEAMS': {
      return {
        ...state,
        match: {
          ...state.match,
          team1: { ...state.match.team1, ...action.team1 },
          team2: { ...state.match.team2, ...action.team2 }
        }
      };
    }

    case 'START_INNINGS': {
      const newState = { ...state };
      newState.match.currentInnings = action.innings;
      newState.match.isMatchActive = true;
      newState.match.currentOverBalls = [];
      
      if (action.innings === 2) {
        // Switch teams for second innings
        const temp = newState.match.battingTeam;
        newState.match.battingTeam = newState.match.bowlingTeam;
        newState.match.bowlingTeam = temp;
        
        // Reset batting team stats
        const battingTeam = newState.match[newState.match.battingTeam];
        battingTeam.totalRuns = 0;
        battingTeam.wickets = 0;
        battingTeam.overs = 0;
        battingTeam.balls = 0;
        battingTeam.extras = { wides: 0, noBalls: 0, byes: 0, legByes: 0 };
        
        // Reset player stats
        battingTeam.players.forEach(player => {
          player.runs = 0;
          player.balls = 0;
          player.fours = 0;
          player.sixes = 0;
          player.isOut = false;
          player.isBatting = false;
          player.isOnStrike = false;
        });
      }
      
      return newState;
    }

    case 'END_INNINGS': {
      return {
        ...state,
        match: {
          ...state.match,
          isMatchActive: false
        }
      };
    }

    case 'ADD_RUNS': {
      const newState = { ...state };
      const battingTeam = newState.match[newState.match.battingTeam];
      const striker = battingTeam.players.find(p => p.isOnStrike && p.isBatting);
      
      if (striker) {
        striker.runs += action.runs;
        striker.balls += 1;
        if (action.runs === 4) striker.fours += 1;
        if (action.runs === 6) striker.sixes += 1;
      }
      
      battingTeam.totalRuns += action.runs;
      battingTeam.balls += 1;
      
      // Create ball event
      const ballEvent: BallEvent = {
        over: battingTeam.overs + 1,
        ball: battingTeam.balls,
        runs: action.runs,
        batter: striker?.name || '',
        bowler: newState.match.currentBowler,
        outcome: action.runs.toString() as BallEvent['outcome']
      };
      
      newState.match.ballByBall.push(ballEvent);
      newState.match.currentOverBalls.push(ballEvent);
      
      // Switch strike on odd runs
      if (action.runs % 2 === 1) {
        battingTeam.players.forEach(p => {
          if (p.isBatting) p.isOnStrike = !p.isOnStrike;
        });
      }
      
      // Check for over completion
      if (battingTeam.balls === 6) {
        battingTeam.overs += 1;
        battingTeam.balls = 0;
        newState.match.currentOverBalls = [];
        // Switch strike at end of over
        battingTeam.players.forEach(p => {
          if (p.isBatting) p.isOnStrike = !p.isOnStrike;
        });
      }
      
      newState.isFreeHit = false;
      return newState;
    }
    
    case 'ADD_EXTRA': {
      const newState = { ...state };
      const battingTeam = newState.match[newState.match.battingTeam];
      
      battingTeam.extras[action.extraType] += 1;
      battingTeam.totalRuns += action.runs;
      
      let outcome: BallEvent['outcome'] = 'Wd';
      if (action.extraType === 'noBall') outcome = 'Nb';
      else if (action.extraType === 'bye') outcome = 'B';
      else if (action.extraType === 'legBye') outcome = 'Lb';
      
      // Create ball event
      const ballEvent: BallEvent = {
        over: battingTeam.overs + 1,
        ball: battingTeam.balls + 1,
        runs: action.runs,
        extras: action.extraType,
        batter: battingTeam.players.find(p => p.isOnStrike)?.name || '',
        bowler: newState.match.currentBowler,
        outcome
      };
      
      // Wide and No-ball don't count as legal deliveries
      if (action.extraType === 'wide' || action.extraType === 'noBall') {
        if (action.extraType === 'noBall') {
          newState.isFreeHit = true;
        }
      } else {
        battingTeam.balls += 1;
        ballEvent.ball = battingTeam.balls;
        newState.match.currentOverBalls.push(ballEvent);
        
        if (battingTeam.balls === 6) {
          battingTeam.overs += 1;
          battingTeam.balls = 0;
          newState.match.currentOverBalls = [];
        }
      }
      
      newState.match.ballByBall.push(ballEvent);
      return newState;
    }
    
    case 'WICKET': {
      const newState = { ...state };
      const battingTeam = newState.match[newState.match.battingTeam];
      const striker = battingTeam.players.find(p => p.isOnStrike && p.isBatting);
      
      if (striker) {
        striker.isOut = true;
        striker.howOut = action.wicketType;
        striker.isBatting = false;
        striker.isOnStrike = false;
        battingTeam.wickets += 1;
        
        // Bring in new batsman
        const newBatsman = battingTeam.players.find(p => !p.isOut && !p.isBatting);
        if (newBatsman) {
          newBatsman.isBatting = true;
          newBatsman.isOnStrike = true;
        }
      }
      
      battingTeam.balls += 1;
      
      // Create ball event
      const ballEvent: BallEvent = {
        over: battingTeam.overs + 1,
        ball: battingTeam.balls,
        runs: 0,
        wicket: true,
        batter: striker?.name || '',
        bowler: newState.match.currentBowler,
        outcome: 'W'
      };
      
      newState.match.ballByBall.push(ballEvent);
      newState.match.currentOverBalls.push(ballEvent);
      
      if (battingTeam.balls === 6) {
        battingTeam.overs += 1;
        battingTeam.balls = 0;
        newState.match.currentOverBalls = [];
      }
      
      newState.isFreeHit = false;
      return newState;
    }
    
    case 'SWITCH_STRIKE': {
      const newState = { ...state };
      const battingTeam = newState.match[newState.match.battingTeam];
      battingTeam.players.forEach(p => {
        if (p.isBatting) p.isOnStrike = !p.isOnStrike;
      });
      return newState;
    }
    
    case 'UPDATE_BOWLER': {
      return {
        ...state,
        match: {
          ...state.match,
          currentBowler: action.bowler
        }
      };
    }
    
    case 'SET_FREE_HIT': {
      return {
        ...state,
        isFreeHit: action.value
      };
    }
    
    default:
      return state;
  }
}

const CricketContext = createContext<{
  state: CricketState;
  dispatch: React.Dispatch<CricketAction>;
} | null>(null);

export const CricketProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cricketReducer, initialState);
  
  return (
    <CricketContext.Provider value={{ state, dispatch }}>
      {children}
    </CricketContext.Provider>
  );
};

export const useCricket = () => {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
};
