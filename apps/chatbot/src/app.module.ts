import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@libs/config/config.module';
import { ConfigService } from '@libs/config/services/config.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                configService.getDatabaseConfig(),
        }),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
