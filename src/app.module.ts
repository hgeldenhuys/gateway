import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServerGateway } from './server.gateway'

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, ServerGateway],
})
export class AppModule {}
