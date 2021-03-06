import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServerGateway } from './server.gateway'
import { ClientGateway } from './client.gateway'
import { CqrsModule } from '@nestjs/cqrs'
import { ConnectedCommand } from './commands/connected.command'
import { InputChangeCommand } from './commands/input-change-command'
import { ConnectedCommandHandler } from './command-handlers/connected-command-handler'
import { MatchedCommand } from './commands/matched-command'
import { InputChangeCommandHandler } from './command-handlers/input-change-command-handler'
import { MatchedCommandHandler } from './command-handlers/matched-command-handler'
import { DisconnectedCommand } from './commands/disconnected-command'
import { DisconnectedCommandHandler } from './command-handlers/disconnected-command-handler'

const commands = [ConnectedCommand, InputChangeCommand, MatchedCommand, DisconnectedCommand]
const commandHandlers = [
	ConnectedCommandHandler,
	MatchedCommandHandler,
	InputChangeCommandHandler,
	DisconnectedCommandHandler,
]

@Module({
	imports: [CqrsModule],
	controllers: [AppController],
	providers: [AppService, ServerGateway, ClientGateway, ...commands, ...commandHandlers],
})
export class AppModule {}
