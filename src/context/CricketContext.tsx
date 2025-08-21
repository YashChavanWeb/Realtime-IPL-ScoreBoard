import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Player {
  id: string;
  name: string;
  type: 'batsman' | 'bowler' | 'all-rounder';
  role: 'player' | 'wicket-keeper' | 'captain';
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
  ballEvents: BallEvent[];
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
    stadium: 'Wankhede Stadium, Mumbai',
    team1: {
      id: 'team1',
      name: 'Mumbai Indians',
      players: [
        { id: 'mi1', name: 'Rohit Sharma', type: 'batsman', role: 'captain', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: true, isOnStrike: true },
        { id: 'mi2', name: 'Ishan Kishan', type: 'batsman', role: 'wicket-keeper', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: true, isOnStrike: false },
        { id: 'mi3', name: 'Suryakumar Yadav', type: 'batsman', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi4', name: 'Tilak Varma', type: 'batsman', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi5', name: 'Hardik Pandya', type: 'all-rounder', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi6', name: 'Kieron Pollard', type: 'all-rounder', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi7', name: 'Krunal Pandya', type: 'all-rounder', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi8', name: 'Jasprit Bumrah', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi9', name: 'Trent Boult', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi10', name: 'Rahul Chahar', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'mi11', name: 'Nathan Coulter-Nile', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false }
      ],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    },
    team2: {
      id: 'team2',
      name: 'Chennai Super Kings',
      players: [
        { id: 'csk1', name: 'MS Dhoni', type: 'batsman', role: 'captain', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk2', name: 'Ruturaj Gaikwad', type: 'batsman', role: 'wicket-keeper', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk3', name: 'Faf du Plessis', type: 'batsman', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk4', name: 'Ambati Rayudu', type: 'batsman', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk5', name: 'Ravindra Jadeja', type: 'all-rounder', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk6', name: 'Moeen Ali', type: 'all-rounder', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk7', name: 'Suresh Raina', type: 'batsman', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk8', name: 'Deepak Chahar', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk9', name: 'Shardul Thakur', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk10', name: 'Imran Tahir', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false },
        { id: 'csk11', name: 'Josh Hazlewood', type: 'bowler', role: 'player', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isBatting: false, isOnStrike: false }
      ],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    },
    battingTeam: 'team1',
    bowlingTeam: 'team2',
    tossWinner: 'Mumbai Indians',
    totalOvers: 20,
    currentBowler: '',
    isMatchActive: false,
    currentInnings: 1,
    ballByBall: [],
    currentOverBalls: []
  },
  isFreeHit: false,
  isSetupComplete: true,
  ballEvents: []
};

// Text-to-speech function
const speakAction = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
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
        
        // Text-to-speech announcement
        if (action.runs === 0) {
          speakAction(`Dot ball by ${striker.name}`);
        } else if (action.runs === 4) {
          speakAction(`Four! ${action.runs} runs by ${striker.name}`);
        } else if (action.runs === 6) {
          speakAction(`Six! ${action.runs} runs by ${striker.name}`);
        } else {
          speakAction(`${action.runs} run${action.runs > 1 ? 's' : ''} by ${striker.name}`);
        }
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
      newState.ballEvents = [...newState.ballEvents, ballEvent];
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
        speakAction(`End of over ${battingTeam.overs}`);
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
      
      // Text-to-speech announcement
      if (action.extraType === 'wide') {
        speakAction(`Wide ball, ${action.runs} extra run${action.runs > 1 ? 's' : ''}`);
      } else if (action.extraType === 'noBall') {
        speakAction(`No ball, ${action.runs} extra run${action.runs > 1 ? 's' : ''}`);
      }
      
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
          speakAction('Free hit coming up');
        }
      } else {
        battingTeam.balls += 1;
        ballEvent.ball = battingTeam.balls;
        newState.match.currentOverBalls.push(ballEvent);
        
        if (battingTeam.balls === 6) {
          battingTeam.overs += 1;
          battingTeam.balls = 0;
          newState.match.currentOverBalls = [];
          speakAction(`End of over ${battingTeam.overs}`);
        }
      }
      
      newState.match.ballByBall.push(ballEvent);
      newState.ballEvents = [...newState.ballEvents, ballEvent];
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
        
        // Text-to-speech announcement
        speakAction(`Wicket! ${striker.name} is out ${action.wicketType}`);
        
        // Bring in new batsman
        const newBatsman = battingTeam.players.find(p => !p.isOut && !p.isBatting);
        if (newBatsman) {
          newBatsman.isBatting = true;
          newBatsman.isOnStrike = true;
          speakAction(`${newBatsman.name} comes to the crease`);
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
      newState.ballEvents = [...newState.ballEvents, ballEvent];
      newState.match.currentOverBalls.push(ballEvent);
      
      if (battingTeam.balls === 6) {
        battingTeam.overs += 1;
        battingTeam.balls = 0;
        newState.match.currentOverBalls = [];
        speakAction(`End of over ${battingTeam.overs}`);
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
