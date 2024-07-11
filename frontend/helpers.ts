export const isBrowser = (): boolean => typeof window !== 'undefined' && typeof localStorage !== 'undefined';
