export type Player = {
  id: string;
  nickname: string;
  score: number;
  isReady: boolean;
  emoji: string;
};

export type Question = {
  text: string;
};

export type Duel = {
  answer: string;
  left: Player;
  right: Player;
};

export type State = {
  host: string;
  roundCount: number;
  screen: 'lobby' | 'duel' | 'questionAsked';
  players: Map<string, Player>;
  currentQuestion: Question;
  currentDuel: Duel;
};
