/* eslint-disable no-console */
import { useQuery } from 'react-query';
import { DateValue } from '../components/visualization/sparkline';

const apiRoot = process.env.NODE_ENV === 'development' ? 'http://localhost:8282' : '';

const fetchTeams = async (): Promise<string[]> => {
  const endpoint = `${apiRoot}/api/teams`;
  const res = await fetch(endpoint, { method: 'get' });
  return res.json();
};

export const useTeams = (): string[] => {
  const {
    isLoading, isError, error, isFetching, data,
  } = useQuery('teams', fetchTeams, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'error'],
  });
  if (isLoading) console.log('loading teams...');
  if (isFetching) console.log('fetching teams...');
  if (isError) {
    console.log('error!!!', error);
  }
  return data || [];
};

const fetchMembers = async (selectedTeam: string | null): Promise<string[]> => {
  if (selectedTeam === null) return [];
  const endpoint = `${apiRoot}/api/members?team=${selectedTeam}`;
  const response = await fetch(endpoint);
  const members: string[] = await response.json();
  return members;
};

export const useMembers = (selectedTeam: string | null): string[] => {
  const {
    isLoading, isError, error, isFetching, data,
  } = useQuery(['members', selectedTeam], () => fetchMembers(selectedTeam), {
    enabled: !!selectedTeam,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'error'],
  });
  if (isLoading) console.log(`loading members ${selectedTeam}`);
  if (isFetching) console.log(`fetching members ${selectedTeam}`);
  if (isError) {
    console.log('error!!!', error);
  }
  return data || [];
};

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

const fetchMoods = async (
  selectedTeam: string | null, members: string[],
  ): Promise<{ teamHistory: DateValue[], moodHistory: DateValue[][] }> => {
    if (selectedTeam === null) return { teamHistory: [], moodHistory: [] };
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
    return { teamHistory, moodHistory };
};

export const useMoods = (selectedTeam: string | null, members: string[]):
  { teamHistory: DateValue[]; moodHistory: DateValue[][] } => {
  const {
    isLoading, isError, error, isFetching, data,
  } = useQuery('members', () => fetchMoods(selectedTeam, members), {
    enabled: !!selectedTeam && members.length > 0,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'error'],
  });
  if (isLoading) console.log(`loading moods ${selectedTeam}`);
  if (isFetching) console.log(`fetching moods ${selectedTeam}`);
  if (isError) {
    console.log('error!!!', error);
  }
  return data || { teamHistory: [], moodHistory: [] };
};
