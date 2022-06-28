import { InputChangedEvent, ServerEvents } from './events'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CommandBus } from '@nestjs/cqrs'
import { ConnectedCommand } from './commands/connected.command'
import { InputChangeCommand } from './commands/input-change-command'
import { DisconnectedCommand } from './commands/disconnected-command'

const clients: Record<string, Socket> = {}

@WebSocketGateway({
	namespace: 'client',
	cors: {
		origin: '*',
		methods: ['get', 'post'],
	},
})
export class ClientGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server
	constructor(private readonly commandBus: CommandBus) {}
	async handleConnection(@ConnectedSocket() client: Socket) {
		if (!clients[client.id]) {
			console.log('handleConnection')
			clients[client.id] = client
			client.join('game')
			return await this.commandBus.execute(new ConnectedCommand({ id: client.id, as: 'client' }))
		}
	}
	async handleDisconnect(@ConnectedSocket() client: Socket) {
		if (clients[client.id]) {
			delete clients[client.id]
			return await this.commandBus.execute(new DisconnectedCommand({ id: client.id, as: 'client' }))
		}
	}

	@SubscribeMessage(ServerEvents.InputChanged)
	async inputChanged(@ConnectedSocket() client: Socket, @MessageBody() inputChangedEvent: InputChangedEvent) {
		console.log({ inputChangedEvent })
		return await this.commandBus.execute(new InputChangeCommand(inputChangedEvent, client.id))
	}

	join(server: string, client: string) {
		clients[client].join(client)
	}
}
