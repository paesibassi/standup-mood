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
  isAlertVisible: boolean;
  messageHeading: string;
  messageBody: string;
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      totalTime: initialTotalTime,
      individualTime: 0,
      running: false,
      members: teamMembers,
      activeMembers: Array(teamMembers.length).fill(true),
      memberScores: Array(teamMembers.length).fill(3.0),
      memberIdx: 0,
      elapsedSecs: Array(teamMembers.length).fill(0),
      completedBars: Array(teamMembers.length).fill(false),
      isAlertVisible: false,
      messageHeading: '',
      messageBody: '',
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
    if (next !== -1) {
      this.setState({
        completedBars,
        memberIdx: next,
      });
    }
  }

  async handleSubmit() {
    const { members, activeMembers, memberScores } = this.state;
    const endpoint = '/api/moods';
    const moodScores = members.reduce((ms: {[key: string]: number;}, member: string, i: number) => {
      if (activeMembers[i]) {
        ms[member] = memberScores[i]; // eslint-disable-line no-param-reassign
      }
      return ms;
    }, {});
    try {
      const response = await fetch(endpoint,
        {
          method: 'post',
          mode: 'same-origin',
          body: JSON.stringify({
            date: new Date().toISOString(), // current UTC datetime
            team: 'OneClientCore', // TODO make the team a param
            moods: moodScores,
          }),
          headers: {
            'content-type': 'application/json',
          },
        });
      const data = await response.json();
      if (!response.ok) {
        this.showAlertMessage('Error', `Something went wrong, an error occurred when posting the moods: ${response.statusText}`);
      } else {
        this.showAlertMessage('Success!', `Stored ${data.moods} mood scores for today`);
      }
    } catch (error) {
        this.showAlertMessage('Error', `Something went wrong, an error occurred when posting the moods: ${error}`);
    }
  }

  handleCloseAlert() {
    const { isAlertVisible } = this.state;
    this.setState({
      isAlertVisible: !isAlertVisible,
    });
  }

  showAlertMessage(messageHeading: string, messageBody: string): void {
    this.setState({
      isAlertVisible: true,
      messageHeading,
      messageBody,
    });
  }

  startButtonState(): string {
    const {
      running, memberIdx, members, activeMembers,
    } = this.state;
    if (running) {
      return 'Stop';
    } if (memberIdx === members.length - 1) {
      // TODO change this logic so it's only complete when all active have spoken
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
      elapsedSecs, completedBars, isAlertVisible, messageHeading, messageBody,
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
        handleSubmit={this.handleSubmit}
        isAlertVisible={isAlertVisible}
        messageHeading={messageHeading}
        messageBody={messageBody}
        handleCloseAlert={this.handleCloseAlert}
      />
    );
  }
}

export default hot(module)(App);
