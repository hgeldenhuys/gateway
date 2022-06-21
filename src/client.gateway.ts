import { InputChangedEvent, ServerEvents } from './events'
import {
	ConnectedSocket,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CommandBus } from '@nestjs/cqrs'
import { ConnectedCommand } from './commands/connected.command'
import { InputChangeCommand } from './commands/input-change-command'

const clients: Record<string, Socket> = {}

@WebSocketGateway({
	namespace: 'client',
	cors: {
		origin: '*',
		methods: ['get', 'post'],
	},
})
export class ClientGateway implements OnGatewayConnection {
	@WebSocketServer() server: Server
	constructor(private readonly commandBus: CommandBus) {}
	@SubscribeMessage(ServerEvents.InputChanged)
	async handleConnection(@ConnectedSocket() client: Socket) {
		clients[client.id] = client
		return await this.commandBus.execute(new ConnectedCommand({ id: client.id, as: 'client' }))
	}

	async inputChanged(@ConnectedSocket() client: Socket, inputChangedEvent: InputChangedEvent) {
		return await this.commandBus.execute(new InputChangeCommand(inputChangedEvent))
	}

	join(server: string, client: string) {
		clients[client].join(`${server}-${client}`)
	}
}
