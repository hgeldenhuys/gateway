import { InputChangedEvent, ServerEvents } from './events'
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@WebSocketGateway({
	namespace: 'client',
	cors: {
		origin: '*',
		methods: ['get', 'post'],
	},
})
export class ClientGateway {
	@SubscribeMessage(ServerEvents.InputChanged)
	inputChanged(@ConnectedSocket() client: Socket, inputChangedEvent: InputChangedEvent) {
		return inputChangedEvent
	}
}
