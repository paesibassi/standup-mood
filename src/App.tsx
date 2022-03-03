import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import './App.css';
import {
  individualSeconds, progressPerc, progressVariant, shuffleArray,
} from './util';
import team from './resources/team.json';
import MainGrid from './components/maingrid';

setConfig({
  showReactDomPatchNotification: false,
});

const increment = 1;
const initialTotalTime = 15 * 60;
const refreshRate = 1000; // 1 second
const teamMembers = shuffleArray(team);

type Props = {
};

type State = {
  totalTime: number;
  individualTime: number;
  running: boolean;
  members: string[];
  activeMembers: boolean[];
  memberScores: number[];
  memberIdx: number;
  elapsedSecs: number[];
  completedBars: boolean[];
};

class App extends React.Component<Props, State> {
  timerID!: ReturnType<typeof setInterval>;

  constructor(props: Props) {
    super(props);
    this.handleChangeRange = this.handleChangeRange.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleChangeMood = this.handleChangeMood.bind(this);
    this.handleSelectMember = this.handleSelectMember.bind(this);
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      totalTime: initialTotalTime,
      individualTime: 0,
      running: false,
      members: teamMembers,
      activeMembers: Array(teamMembers.length).fill(true), // TODO change to false
      memberScores: Array(teamMembers.length).fill(3.0),
      memberIdx: 0,
      elapsedSecs: Array(teamMembers.length).fill(0),
      completedBars: Array(teamMembers.length).fill(false),
    };
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleChangeRange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { activeMembers } = this.state;
    const totalTime = Number(e.target.value) * 60;
    this.setState({
      totalTime,
      individualTime: individualSeconds(totalTime, activeMembers),
    });
  }

  handleSwitch(idx: number): void {
    const { totalTime, activeMembers } = this.state;
    activeMembers[idx] = !activeMembers[idx];
    this.setState({
      individualTime: individualSeconds(totalTime, activeMembers),
      activeMembers,
    });
  }

  handleSelectMember(idx: number): void {
    this.setState({ memberIdx: idx });
  }

  handleChangeMood(idx: number, e: React.ChangeEvent<HTMLInputElement>): void {
    const { memberScores } = this.state;
    memberScores[idx] = parseFloat(e.target.value);
    this.setState({ memberScores });
  }

  handleStartStop(): void {
    const { running, activeMembers, memberIdx } = this.state;
    if (running) {
      clearInterval(this.timerID);
    } else {
      if (this.startButtonState() === 'Reset') {
        this.setState({
          elapsedSecs: Array(teamMembers.length).fill(0),
          memberIdx: 0,
        });
      }
      if (activeMembers[memberIdx] === false) {
        this.handleNext();
      }
      this.timerID = setInterval(() => this.tick(), refreshRate);
    }
    this.setState({ running: !running });
  }

  handleNext(): void {
    const { activeMembers, memberIdx, completedBars } = this.state;
    completedBars[memberIdx] = true;
    const next = activeMembers.indexOf(true, memberIdx + 1);
    this.setState({
      completedBars,
      memberIdx: next,
    });
  }

  startButtonState(): string {
    const {
      running, memberIdx, members, activeMembers,
    } = this.state;
    if (running) {
      return 'Stop';
    } if (memberIdx === members.length - 1) {
      return 'Reset';
    } if (activeMembers.filter(Boolean).length === 0) {
      return 'Select Members';
    }
    return 'Start';
  }

  tick(): void {
    const {
      individualTime, memberIdx, elapsedSecs, members,
    } = this.state;
    if (elapsedSecs[memberIdx] >= individualTime) {
      if (memberIdx === members.length - 1) {
        this.setState({ running: false });
        clearInterval(this.timerID);
      } else {
        this.handleNext();
      }
    } else {
      elapsedSecs[memberIdx] += increment;
      this.setState({ elapsedSecs });
    }
  }

  render() {
    const {
      totalTime, individualTime, members, activeMembers, memberScores, memberIdx,
      elapsedSecs, completedBars,
    } = this.state;
    const numActiveMembers = activeMembers.filter(Boolean).length;
    const sumMood = memberScores.filter((_, i) => activeMembers[i]).reduce((a, b) => a + b, 0);
    const averageMood = sumMood / activeMembers.filter(Boolean).length;
    const disabledNext = (memberIdx === members.length - 1)
    || (activeMembers.filter(Boolean).length === 0);
    const elapsedPercents = elapsedSecs.map((s) => progressPerc(s, individualTime));
    const barColors = elapsedPercents.map((p, i) => (completedBars[i] ? 'success' : progressVariant(p)));
    return (
      <MainGrid
        totalTime={totalTime}
        numActiveMembers={numActiveMembers}
        individualTime={individualTime}
        handleChangeRange={this.handleChangeRange}
        members={members}
        memberIdx={memberIdx}
        elapsedSecs={elapsedSecs}
        activeMembers={activeMembers}
        memberScores={memberScores}
        averageMood={averageMood}
        handleSwitch={this.handleSwitch}
        handleChangeMood={this.handleChangeMood}
        handleSelectMember={this.handleSelectMember}
        startButtonState={this.startButtonState()}
        handleStartStop={this.handleStartStop}
        disabledNext={disabledNext}
        handleNext={this.handleNext}
        elapsedPercents={elapsedPercents}
        barColors={barColors}
      />
    );
  }
}

export default hot(module)(App);
