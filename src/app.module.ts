import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServerGateway } from './server.gateway'
import { ClientGateway } from './client.gateway';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, ServerGateway, ClientGateway],
})
export class AppModule {}
