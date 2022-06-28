import { Injectable } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { InputChangeCommand } from '../commands/input-change-command'
import { ServerGateway } from '../server.gateway'

@Injectable()
@CommandHandler(InputChangeCommand)
export class InputChangeCommandHandler {
	constructor(private readonly server: ServerGateway) {}
	async execute(command: InputChangeCommand) {
		// console.log('InputChangeCommand', command.inputChanged)
		this.server.send(command.inputChanged, command.id)
		// await this.server.join(command.event)
	}
}
