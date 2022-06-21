import { Injectable } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { MatchedCommand } from '../commands/matched-command'
import { ServerGateway } from '../server.gateway'
import { ConnectedCommand } from '../commands/connected.command'

@Injectable()
@CommandHandler(MatchedCommand)
export class MatchedCommandHandler {
	constructor(private readonly server: ServerGateway) {}
	async execute(command: ConnectedCommand) {
		console.log('Matched')
		// await this.server.join(command.event)
	}
}
