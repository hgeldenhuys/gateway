export enum ServerEvents {
  Connected = 'Connected',
  InputChanged = 'InputChanged',
}

export enum ClientEvents {
  GameStarted = 'GameStarted',
  GameEnded = 'GameEnded',
}

export interface GameStartedEvent {
  game: {
    name: string;
  };
}

export interface GameOverEvent {
  game: {
    name: string;
    score: number;
  };
}

export interface ConnectedEvent {
  id: string;
}

export type Vector = [number, number];

export interface InputChangedEvent {
  keys?: Array<number>;
  left?: Vector;
  right?: Vector;
}
