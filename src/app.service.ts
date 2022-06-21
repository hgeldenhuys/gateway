import { Injectable } from '@nestjs/common'
import { ConnectedEvent, MatchedEvent } from './events'
import { CommandBus } from '@nestjs/cqrs'
import { MatchedCommand } from './commands/matched-command'
import { ServerGateway } from './server.gateway'

const clients: Array<string> = []
const servers: Array<string> = []
const matched: Array<MatchedEvent> = []

@Injectable()
export class AppService {
	constructor(private readonly commandBus: CommandBus, private readonly server: ServerGateway) {}
	async connect(connectedEvent: ConnectedEvent) {
		console.log('app.connected', connectedEvent)
		if (connectedEvent.as === 'client') clients.push(connectedEvent.id)
		else servers.push(connectedEvent.id)
		if (clients.length && servers.length) {
			const client = clients.pop()
			const server = servers.pop()
			matched.push({ client, server })
			this.server.join(server, client)
			return await this.commandBus.execute(new MatchedCommand({ client, server }))
		}
	}
}
