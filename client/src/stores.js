import { writable } from 'svelte/store';

export const gameData = writable({
  collectedChakras: 0,
});
