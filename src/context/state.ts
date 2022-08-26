import { individualSeconds, shuffleArray } from '../util';
import { DateValue } from '../components/visualization/sparkline';

export type startButtonValues = 'Stop' | 'Select Members' | 'Start';

export type State = {
  totalTime: number;
  individualTime: number;
  running: boolean;
  teams: string[];
  selectedTeam: string | null;
  members: string[];
  activeMembers: boolean[];
  memberScores: number[];
  memberIdx: number;
  elapsedSecs: number[];
  completedBars: boolean[];
  isAlertVisible: boolean;
  messageHeading: string;
  messageBody: string;
  setState?: (s: Omit<State, 'setState'>) => void;
  updateState?: (p: Partial<State>) => void;
  teamHistory?: DateValue[];
  moodHistory?: DateValue[][];
  barColors?: string[];
  disabledNext?: boolean;
  elapsedPercents?: number[];
  numActiveMembers?: number;
  averageMood?: number;
  startButtonState?: startButtonValues;
  submitted: boolean;
  showAlertMessage?: (h: string, b: string) => void;
  handleChangeMood?: (idx: number, value: number) => void;
  handleChangeTeam?: (eventKey: string | null, event: React.SyntheticEvent<unknown, Event>) => void;
  handleChangeTime?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleCloseAlert?: () => void;
  handleNext?: () => void;
  handleSelectMember?: (idx: number) => void;
  handleStartStop?: () => void;
  handleSubmit?: () => void; // async
  handleSwitch?: (idx: number) => void;
};

const initialTotalTime = 15 * 60;

type teamStateSlice = Pick< State,
  'activeMembers' |
  'completedBars' |
  'elapsedSecs' |
  'individualTime' |
  'members' |
  'memberScores'
  >;

export function initializeTeam(members: string[]): teamStateSlice {
  if (members.length === 0) {
    return {
      activeMembers: [false],
      completedBars: [false],
      elapsedSecs: [0],
      individualTime: 0,
      members: [],
      memberScores: [0],
    };
  }
  const teamMembers = shuffleArray(members);
  return {
      activeMembers: Array(teamMembers.length).fill(true),
      completedBars: Array(teamMembers.length).fill(false),
      elapsedSecs: Array(teamMembers.length).fill(0),
      individualTime: individualSeconds(initialTotalTime, Array(teamMembers.length).fill(true)),
      members: teamMembers,
      memberScores: Array(teamMembers.length).fill(3.0),
  };
}

export function getInitialState(): State {
  const initialTeam = initializeTeam([]);
  return {
      ...initialTeam,
      isAlertVisible: false,
      memberIdx: 0,
      messageBody: '',
      messageHeading: '',
      running: false,
      selectedTeam: null,
      submitted: false,
      teams: [],
      totalTime: initialTotalTime,
  };
}
