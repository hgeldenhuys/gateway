import { CommandHandler } from '@nestjs/cqrs'
import { ConnectedCommand } from '../commands/connected.command'
import { Injectable } from '@nestjs/common'
import { AppService } from '../app.service'

@Injectable()
@CommandHandler(ConnectedCommand)
export class ConnectedCommandHandler {
	constructor(private readonly app: AppService) {}
	async execute(command: ConnectedCommand) {
		await this.app.connect(command.event)
	}
}
