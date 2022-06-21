import { ClientEvents, ConnectedEvent, GameEndedEvent, GameStartedEvent, ServerEvents } from './events'
import {
	ConnectedSocket,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ConnectedCommand } from './commands/connected.command'
import { CommandBus } from '@nestjs/cqrs'

const servers: Record<string, Socket> = {}

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
		servers[client.id] = client
		return await this.commandBus.execute(new ConnectedCommand({ id: client.id, as: 'server' }))
	}

	@SubscribeMessage(ClientEvents.GameStarted)
	gameStarted(@ConnectedSocket() client: Socket, gameStartedEvent: GameStartedEvent) {
		return gameStartedEvent
	}
	@SubscribeMessage(ClientEvents.GameEnded)
	gameEnded(@ConnectedSocket() client: Socket, gameEndedEvent: GameEndedEvent) {
		return gameEndedEvent
	}
	join(server: string, client: string) {
		console.log('JOIN')
		servers[server].join(`${server}-${client}`)
		const event: ConnectedEvent = {
			id: client,
			as: 'client',
		}
		console.log('Emitting', `${server}-${client}`, ServerEvents.Connected, event)
		this.server.in(`${server}-${client}`).emit(ServerEvents.Connected, event)
	}
	start() {
		// servers
	}
}
