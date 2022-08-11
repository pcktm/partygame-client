export type Player = {
  id: string;
  nickname: string;
  score: number;
  isReady: boolean;
  emoji: string;
};

export type Question = {
  text: string;
  answers: Map<string, string>;
};

export type Duel = {
  answer: string;
  left: Player;
  right: Player;
  revealVotes: boolean;
  votes: Map<string, string>;
};

export type State = {
  host: string;
  roundCount: number;
  screen: 'lobby' | 'duel' | 'questionAsked' | 'votesRevealed' | 'scores' | 'whoSaidWhat';
  players: Map<string, Player>;
  finalScores: Player[];
  currentQuestion: Question;
  currentDuel: Duel;
};
