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
  correctPlayerId?: string;
  revealVotes: boolean;
  votes: Map<string, string>;
};

export type State = {
  host: string;
  roundCount: number;
  screen: 'lobby' | 'duel' | 'questionAsked' | 'votesRevealed' | 'scores';
  players: Map<string, Player>;
  currentQuestion: Question;
  currentDuel: Duel;
};
