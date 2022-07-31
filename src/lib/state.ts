export type Player = {
  nickname: string;
  score: number;
  isReady: boolean;
  emoji: string;
};

export type State = {
  screen: 'lobby' | 'questionScores' | 'questionAsked';
  players: Map<string, Player>;
};
