import { ClientEvents, GameOverEvent, GameStartedEvent } from './events'
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@WebSocketGateway({
	namespace: 'server',
	cors: {
		origin: '*',
		methods: ['get', 'post'],
	},
})
export class ServerGateway {
	@SubscribeMessage(ClientEvents.GameStarted)
	gameStarted(@ConnectedSocket() client: Socket, gameStartedEvent: GameStartedEvent) {
		return gameStartedEvent
	}
	@SubscribeMessage(ClientEvents.GameStarted)
	gameEnded(@ConnectedSocket() client: Socket, gameOverEvent: GameOverEvent) {
		return gameOverEvent
	}
}
