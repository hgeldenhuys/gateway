import { Injectable } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { DisconnectedCommand } from '../commands/disconnected-command'
import { AppService } from '../app.service'
import { ConnectedCommand } from '../commands/connected.command'

@Injectable()
@CommandHandler(DisconnectedCommand)
export class DisconnectedCommandHandler {
	constructor(private readonly app: AppService) {}
	async execute(command: ConnectedCommand) {
		await this.app.disconnect(command.event)
	}
}
