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
		name: string
	}
}

export interface GameEndedEvent {
	game: {
		name: string
		score: number
	}
}

export interface ConnectedEvent {
	id: string
	as: 'client' | 'server'
}

export type Vector = [number, number]

export interface InputChangedEvent {
	keys?: Array<number>
	left?: Vector
	right?: Vector
}

export interface MatchedEvent {
	client: string
	server: string
}
