import React, {
 createContext, FC, ReactNode, useCallback, useContext, useEffect, useState,
} from 'react';
import { getInitialState, State } from './state';
import { individualSeconds, progressPerc, progressVariant } from '../util';

const initialState = getInitialState('OneClientCore');
const AppContext = createContext(initialState);

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
      setState,
      updateState,
      isAlertVisible: true,
      messageHeading,
      messageBody,
    });
  };

  const handleChangeMood = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const { memberScores } = state;
    memberScores[idx] = parseFloat(e.target.value);
    updateState({ memberScores });
  };

  const handleChangeTeam = (
      eventKey: string | null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      event: React.SyntheticEvent<unknown, Event>,
    ): void => {
    if (eventKey && setState) {
      setState(getInitialState(eventKey));
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
    const endpoint = '/api/moods';
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
