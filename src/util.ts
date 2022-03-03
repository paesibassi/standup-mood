type substrIndexes = [number, number];
export const minSecondsSubstr: substrIndexes = [15, 19];
export const minsSecondsSubstr: substrIndexes = [14, 19];
export const hoursMinsSecondsSubstr: substrIndexes = [11, 19];

export function formatTimeMinSecs(seconds: number, sub: substrIndexes = minSecondsSubstr): string {
  return new Date(seconds * 1000).toISOString().substring(...sub);
}

export function individualSeconds(totalTime: number, activeMembers: boolean[]): number {
  const numActive = activeMembers.filter(Boolean).length;
  return (numActive === 0) ? 0 : Math.floor(totalTime / numActive);
}

export function progressPerc(elapsed: number, total: number): number {
  return (total === 0) ? 0 : Math.floor((elapsed / total) * 100);
}

export function progressVariant(percent: number): string {
  if (percent === 100) { return 'success'; }
  if (percent > 90) { return 'danger'; }
  if (percent > 75) { return 'warning'; }
  return '';
}

export function shuffleArray<Type>(arr: Type[]): Type[] {
  const array = arr;
  let randomIndex;
  let currentIndex = arr.length;

  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // and swap it with the current element
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
