import React, {
 createContext, FC, ReactNode, useCallback, useContext, useEffect, useState,
} from 'react';
import { getInitialState, initializeTeam, State } from './state';
import { individualSeconds, progressPerc, progressVariant } from '../util';
import { DateValue } from '../components/visualization/sparkline';

const initialState = getInitialState();
const AppContext = createContext(initialState);
const apiRoot = process.env.NODE_ENV === 'development' ? 'http://localhost:8282' : '';

const increment = 1;
const refreshRate = 1000; // 1 second
let timerID: ReturnType<typeof setInterval>;

const tick = (
    updateState: (p: Partial<State>) => void, memberIdx: number, elapsedSecs: number[],
  ) => {
  const secs = elapsedSecs;
  secs[memberIdx] += increment;
  updateState({ elapsedSecs: secs });
};

export const GlobalProvider: FC<ReactNode> = ({ children }) => {
  const [state, setState] = useState(initialState);
  const updateState = useCallback(
    (partial: Partial<State>) => setState({ ...state, ...partial }),
    [state],
  );

  useEffect(() => {
    if (state.running) {
      timerID = setInterval(
        () => tick(updateState, state.memberIdx, state.elapsedSecs), refreshRate,
        );
      }
    return () => {
      clearInterval(timerID);
    };
  }, [state.running, state.memberIdx, state.elapsedSecs, updateState]);

  const numActiveMembers = state.activeMembers.filter(Boolean).length;
  const disabledNext = (state.memberIdx === state.members.length - 1)
    || (state.activeMembers.filter(Boolean).length === 0);
  const elapsedPercents = state.elapsedSecs.map((s) => progressPerc(s, state.individualTime));
  const barColors = elapsedPercents.map((p, i) => progressVariant(p, state.completedBars[i]));
  const sumMood = state.memberScores.filter(
    (_, i) => state.activeMembers[i],
    ).reduce((a, b) => a + b, 0);
  const averageMood = sumMood / state.activeMembers.filter(Boolean).length;
  const startButtonState = (): string => {
    if (state.running) {
      return 'Stop';
    } if (state.activeMembers.filter(Boolean).length === 0) {
      return 'Select Members';
    }
    return 'Start';
  };

  const showAlertMessage = (messageHeading: string, messageBody: string): void => {
    setState({
      ...state,
      isAlertVisible: true,
      messageHeading,
      messageBody,
    });
  };

  useEffect(() => {
    async function fetchTeams() {
        try {
            const endpoint = `${apiRoot}/api/teams`;
            const response = await fetch(endpoint);
            const teams: string[] = await response.json();
            setState((s) => ({ ...s, teams }));
        } catch (error) {
          /// avoid using showAlertMessage here to avoid the additional dependency for useMemo
          setState((s) => ({
            ...s,
            isAlertVisible: true,
            messageHeading: 'Error',
            messageBody: `Something went wrong, an error occurred when fetching members: ${error}`,
          }));
        }
    }
    // since it depends on state.teams, this should run only once
    fetchTeams();
  }, []);

  useEffect(() => {
    async function fetchMembers(selectedTeam: string): Promise<string[]> {
      try {
        const endpoint = `${apiRoot}/api/members?team=${selectedTeam}`;
        const response = await fetch(endpoint);
        const members: string[] = await response.json();
        const teamState = initializeTeam(members);
        setState((s) => ({ ...s, ...teamState }));
        return members;
      } catch (error) {
        /// avoid using showAlertMessage here to avoid the additional dependency for useMemo
        setState((s) => ({
          ...s,
          isAlertVisible: true,
          messageHeading: 'Error',
          messageBody: `Something went wrong, an error occurred when fetching members: ${error}`,
        }));
        return [];
      }
    }
    async function fetchMoods(selectedTeam: string): Promise<void> {
      try {
        const members: string[] = await fetchMembers(state.selectedTeam);
        if (members.length === 0) return;
        const endpoint = `${apiRoot}/api/moods?team=${selectedTeam}`;
        const response = await fetch(endpoint);
        const moods: {[m: string]: {Date: string, Mood: number}[]} = await response.json();
        const history: DateValue[][] = members.map(
          (m) => moods[m].map(
            (v) => ({ date: v.Date, value: v.Mood }),
            ),
        );
        setState((s) => ({ ...s, memberHistory: history }));
      } catch (error) {
        /// avoid using showAlertMessage here to avoid the additional dependency for useMemo
        setState((s) => ({
          ...s,
          isAlertVisible: true,
          messageHeading: 'Error',
          messageBody: `Something went wrong, an error occurred when fetching mood history: ${error}`,
        }));
      }
    }
    fetchMoods(state.selectedTeam);
  }, [state.selectedTeam]);

  const handleChangeMood = (idx: number, value: number): void => {
    const { memberScores } = state;
    if (Number.isNaN(value) || value > 50) return;
    // let user type decimal numbers between 1 and 5 without the comma, automatically convert them
    let newValue:number;
    if (value > 5) {
      newValue = value / 10;
    } else {
      newValue = value;
    }
    memberScores[idx] = newValue;
    updateState({ memberScores });
  };

  const handleChangeTeam = (
      eventKey: string | null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      event: React.SyntheticEvent<unknown, Event>,
    ): void => {
    if (eventKey) {
      updateState({ selectedTeam: eventKey });
    }
  };

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const time = Number(e.target.value) * 60;
    setState({
      ...state,
      totalTime: time,
      individualTime: individualSeconds(time, state.activeMembers),
    });
  };

  const handleCloseAlert = () => {
    updateState({
      isAlertVisible: !state.isAlertVisible,
    });
  };

  const handleNext = (): void => {
    const { completedBars } = state;
    completedBars[state.memberIdx] = true;
    const next = state.activeMembers.indexOf(true, state.memberIdx + 1);
    if (next !== -1) {
      updateState({ completedBars, memberIdx: next });
    }
  };

  const handleStartStop = (): void => {
    if (state.running) {
      clearInterval(timerID);
    } else {
      if (state.activeMembers[state.memberIdx] === false) {
        handleNext();
      }
      timerID = setInterval(
        () => tick(updateState, state.memberIdx, state.elapsedSecs),
        refreshRate,
      );
    }
    updateState({ running: !state.running });
  };

  const handleSubmit = async () => {
    const endpoint = `${apiRoot}/api/moods`;
    const moodScores = state.members.reduce(
      (ms: { [key: string]: number; }, name: string, i: number) => {
      if (state.activeMembers[i]) {
        ms[name] = state.memberScores[i]; // eslint-disable-line no-param-reassign
      }
      return ms;
    }, {},
    );
    try {
      const response = await fetch(endpoint,
        {
          method: 'post',
          mode: 'same-origin',
          body: JSON.stringify({
            date: new Date().toISOString(), // current UTC datetime
            team: state.selectedTeam,
            moods: moodScores,
          }),
          headers: {
            'content-type': 'application/json',
          },
        });
      const data = await response.json();
      if (!response.ok) {
        showAlertMessage('Error', `Something went wrong, response not ok: ${response.statusText}`);
      } else {
        showAlertMessage('Success!', `Stored ${data.moods} mood scores for today`);
      }
    } catch (error) {
      showAlertMessage('Error', `Something went wrong, an error occurred when posting the moods: ${error}`);
    }
  };

  const handleSelectMember = (idx: number): void => {
    updateState({ memberIdx: idx });
  };

  const handleSwitch = (idx: number): void => {
    const { activeMembers } = state;
    activeMembers[idx] = !activeMembers[idx];
    updateState({
      individualTime: individualSeconds(state.totalTime, activeMembers),
      activeMembers,
    });
  };

  return (
    <React.StrictMode>
      <AppContext.Provider value={{
        ...state,
        setState,
        updateState,
        numActiveMembers,
        barColors,
        disabledNext,
        elapsedPercents,
        averageMood,
        startButtonState: startButtonState(),
        showAlertMessage,
        handleChangeMood,
        handleChangeTeam,
        handleChangeTime,
        handleCloseAlert,
        handleNext,
        handleSelectMember,
        handleStartStop,
        handleSubmit,
        handleSwitch,
      }}
      >
        { children }
      </AppContext.Provider>
    </React.StrictMode>
  );
};

const useGlobalContext = (): State => (useContext(AppContext));

export default useGlobalContext;
