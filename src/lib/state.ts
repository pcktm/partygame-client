export type Player = {
  nickname: string;
  score: number;
  isReady: boolean;
  emoji: string;
  answeredCurrentQuestion: boolean;
};

export type State = {
  host: string;
  roundCount: number;
  screen: 'lobby' | 'duel' | 'questionAsked';
  players: Map<string, Player>;
  currentQuestion: string;
  submittedAnswers: string[];
};
