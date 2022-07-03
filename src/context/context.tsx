import React, {
 createContext, FC, ReactNode, useCallback, useContext, useEffect, useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getInitialState, initializeTeam, startButtonValues, State,
 } from './state';
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
  const location = useLocation();
  const navigate = useNavigate();

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
  const startButtonState = (): startButtonValues => {
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
    function setTeamOnLocation() {
      const path = location.pathname.split('/');
      // root path === ["", ""]
      if (path.length > 2 && path[1] === 'team') {
      const selectedTeam = path[2];
      setState((s) => ({ ...s, selectedTeam }));
      }
    }
    setTeamOnLocation();
  }, [location.pathname]);

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

    interface Value {
      Date: string;
      Mood: number;
    }
    interface MoodSummary {
      min: number;
      max: number;
      q1: number;
      mean: number;
      q3: number;
      values: Value[];
    }
    interface Members {
      [name: string]: MoodSummary;
    }
    interface TeamMoods {
      team: MoodSummary;
      members: Members;
    }

    async function fetchMoods(selectedTeam: string): Promise<void> {
      try {
        const members: string[] = await fetchMembers(selectedTeam);
        if (members.length === 0) return;
        const endpoint = `${apiRoot}/api/moods?team=${selectedTeam}`;
        const response = await fetch(endpoint);
        const teammoods: TeamMoods = await response.json();
        const teamHistory: DateValue[] = teammoods.team.values.map(
          (v) => ({ date: v.Date, value: v.Mood }),
        );
        const moodHistory: DateValue[][] = members.map(
          (memberName) => teammoods.members[memberName].values?.map(
            (v) => ({ date: v.Date, value: v.Mood }),
            ),
        );
        setState((s) => ({ ...s, teamHistory, moodHistory }));
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
    if (state.selectedTeam !== null) { fetchMoods(state.selectedTeam); }
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
      navigate(`/team/${eventKey}`);
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

  const handleNext = (): number => {
    const { completedBars, memberIdx, activeMembers } = state;
    completedBars[memberIdx] = true;
    const next = activeMembers.indexOf(true, memberIdx + 1);
    if (next !== -1) {
      updateState({ completedBars, memberIdx: next });
    }
    return next;
  };

  const handleStartStop = (): void => {
    const { memberIdx, activeMembers, elapsedSecs } = state;
    let next = memberIdx;
    if (state.running) {
      clearInterval(timerID);
    } else {
      if (activeMembers[memberIdx] === false) {
        // the updateState inside of handleNext will be overwritten, so need to use
        // return value for next, and use it to update state here
        next = handleNext();
      }
      timerID = setInterval(
        () => tick(updateState, next, elapsedSecs),
        refreshRate,
      );
    }
    updateState({ running: !state.running, memberIdx: next });
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
