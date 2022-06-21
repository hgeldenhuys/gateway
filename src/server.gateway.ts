import {
	ClientEvents,
	ConnectedEvent,
	GameEndedEvent,
	GameStartedEvent,
	InputChangedEvent,
	ServerEvents,
} from './events'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ConnectedCommand } from './commands/connected.command'
import { CommandBus } from '@nestjs/cqrs'

type Room = string

const servers: Record<string, Socket> = {}
const clients: Record<string, Room> = {}

@WebSocketGateway({
	namespace: 'server',
	cors: {
		origin: '*',
		methods: ['get', 'post'],
	},
})
export class ServerGateway implements OnGatewayConnection {
	@WebSocketServer() server: Server
	constructor(private readonly commandBus: CommandBus) {}
	async handleConnection(@ConnectedSocket() client: Socket) {
		if (!servers[client.id]) {
			servers[client.id] = client
			return await this.commandBus.execute(new ConnectedCommand({ id: client.id, as: 'server' }))
		}
	}

	@SubscribeMessage(ClientEvents.GameStarted)
	gameStarted(@ConnectedSocket() client: Socket, @MessageBody() gameStartedEvent: GameStartedEvent) {
		return gameStartedEvent
	}
	@SubscribeMessage(ClientEvents.GameEnded)
	gameEnded(@ConnectedSocket() client: Socket, @MessageBody() gameEndedEvent: GameEndedEvent) {
		return gameEndedEvent
	}
	join(server: string, client: string) {
		console.log('JOIN')
		servers[server].join(client)
		const event: ConnectedEvent = {
			id: client,
			as: 'client',
		}
		const room = client
		clients[client] = room
		console.log('Emitting', room, ServerEvents.Connected, event)
		this.server.in(room).emit(ServerEvents.Connected, event)
	}
	send(event: InputChangedEvent, id: string) {
		const room = clients[id]
		console.log('Broadcasting', id, ServerEvents.InputChanged, event)
		this.server.in(room).emit(ServerEvents.InputChanged, event)
	}
}
