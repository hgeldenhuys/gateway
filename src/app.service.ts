import { Injectable } from '@nestjs/common'
import { ConnectedEvent, MatchedEvent } from './events'
import { CommandBus } from '@nestjs/cqrs'
import { MatchedCommand } from './commands/matched-command'
import { ServerGateway } from './server.gateway'
import { ClientGateway } from './client.gateway'

const clients: Set<string> = new Set([])
const servers: Set<string> = new Set([])
const matched: Array<MatchedEvent> = []

@Injectable()
export class AppService {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly server: ServerGateway,
		private readonly client: ClientGateway
	) {}
	async connect(connectedEvent: ConnectedEvent) {
		console.log('app.connected', connectedEvent)
		if (connectedEvent.as === 'client') clients.add(connectedEvent.id)
		else servers.add(connectedEvent.id)
		console.log(clients.size && servers.size, clients.size, servers.size)
		if (clients.size && servers.size) {
			const client = Array.from(clients)[0]
			const server = Array.from(servers)[0]
			console.log('?', client, server)
			clients.delete(client)
			servers.delete(server)

			matched.push({ client, server })
			this.server.join(server, client)
			this.client.join(server, client)
			return await this.commandBus.execute(new MatchedCommand({ client, server }))
		}
	}
	async disconnect(connectedEvent: ConnectedEvent) {
		console.log('app.disconnected', connectedEvent)
		if (connectedEvent.as === 'client') {
			clients.delete(connectedEvent.id)
		} else servers.delete(connectedEvent.id)
	}
}
