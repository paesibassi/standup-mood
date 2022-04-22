import { individualSeconds, shuffleArray } from '../util';
import allTeams from '../resources/teams.json';
import { DateValue } from '../components/visualization/sparkline';

export type State = {
  totalTime: number;
  individualTime: number;
  running: boolean;
  teams: string[];
  selectedTeam: string;
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
  updateState?: (s: Omit<State, 'updateState'>) => void;
  memberHistory?: DateValue[][];
  barColors?: string[];
  disabledNext?: boolean;
  elapsedPercents?: number[];
  numActiveMembers?: number;
  averageMood?: number;
  startButtonState?: string;
  showAlertMessage?: (h: string, b: string) => void;
  handleChangeMood?: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => void;
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

export function getInitialState(teamName: string): State {
  const teams = Object.keys(allTeams);
  const team: string[] = (allTeams as { [key: string]: string[]; })[teamName];
  const teamMembers = shuffleArray(team);
  return {
      activeMembers: Array(teamMembers.length).fill(true),
      completedBars: Array(teamMembers.length).fill(false),
      elapsedSecs: Array(teamMembers.length).fill(0),
      individualTime: individualSeconds(initialTotalTime, Array(teamMembers.length).fill(true)),
      isAlertVisible: false,
      memberIdx: 0,
      members: teamMembers,
      memberScores: Array(teamMembers.length).fill(3.0),
      messageBody: '',
      messageHeading: '',
      running: false,
      selectedTeam: teamName,
      teams,
      totalTime: initialTotalTime,
  };
}
