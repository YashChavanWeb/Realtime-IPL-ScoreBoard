
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
  ballByBall: Array<{
    over: number;
    ball: number;
    runs: number;
    extras?: string;
    wicket?: boolean;
    batter: string;
    bowler: string;
  }>;
}

interface CricketState {
  match: Match;
  isFreeHit: boolean;
}

type CricketAction = 
  | { type: 'ADD_RUNS'; runs: number }
  | { type: 'ADD_EXTRA'; extraType: 'wide' | 'noBall' | 'bye' | 'legBye'; runs: number }
  | { type: 'WICKET'; wicketType: string; fielder?: string }
  | { type: 'SWITCH_STRIKE' }
  | { type: 'NEW_OVER' }
  | { type: 'UPDATE_BOWLER'; bowler: string }
  | { type: 'SET_FREE_HIT'; value: boolean }
  | { type: 'UPDATE_PLAYER'; teamId: 'team1' | 'team2'; playerId: string; updates: Partial<Player> };

const initialState: CricketState = {
  match: {
    id: '1',
    stadium: 'Lords Cricket Ground',
    team1: {
      id: 'team1',
      name: 'Team India',
      players: [
        { id: '1', name: 'Rohit Sharma', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: true, isOnStrike: true },
        { id: '2', name: 'Virat Kohli', runs: 9, balls: 3, fours: 1, sixes: 0, isOut: false, isBatting: true, isOnStrike: false },
        { id: '3', name: 'KL Rahul', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { id: '4', name: 'Hardik Pandya', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { id: '5', name: 'MS Dhoni', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      ],
      totalRuns: 9,
      wickets: 0,
      overs: 1,
      balls: 3,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    },
    team2: {
      id: 'team2',
      name: 'England',
      players: [
        { id: '6', name: 'Joe Root', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { id: '7', name: 'Ben Stokes', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { id: '8', name: 'Jos Buttler', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { id: '9', name: 'Jofra Archer', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { id: '10', name: 'James Anderson', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      ],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    },
    battingTeam: 'team1',
    bowlingTeam: 'team2',
    tossWinner: 'Team India',
    totalOvers: 20,
    currentBowler: 'Jofra Archer',
    isMatchActive: true,
    ballByBall: []
  },
  isFreeHit: false
};

function cricketReducer(state: CricketState, action: CricketAction): CricketState {
  switch (action.type) {
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
      
      // Wide and No-ball don't count as legal deliveries
      if (action.extraType === 'wide' || action.extraType === 'noBall') {
        if (action.extraType === 'noBall') {
          newState.isFreeHit = true;
        }
      } else {
        battingTeam.balls += 1;
        if (battingTeam.balls === 6) {
          battingTeam.overs += 1;
          battingTeam.balls = 0;
        }
      }
      
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
      if (battingTeam.balls === 6) {
        battingTeam.overs += 1;
        battingTeam.balls = 0;
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
