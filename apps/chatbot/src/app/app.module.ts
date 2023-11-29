import { Module } from '@nestjs/common';
import { ChatBotController } from '@app/chatbot/src/app/controllers/chat-bot.controller';
import { ConfigModule } from '@libs/config/config.module';
import { ChatBotModule } from '@libs/chat-bot/chat-bot.module';
import { OpenAiModule } from '@libs/open-ai/open-ai.module';
import { CosineModule } from '@libs/cosine/cosine.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@libs/config/services/config.service';
import { ChatBotAdminController } from '@app/chatbot/src/app/controllers/chat-bot-admin.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { DataSetUpdateSchedule } from '@app/chatbot/src/app/schedules/data-set-update.schedule';

const scheduleProviders = [DataSetUpdateSchedule];

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                configService.getDatabaseConfig(),
        }),
        ScheduleModule.forRoot(),
        ConfigModule,
        ChatBotModule,
        OpenAiModule,
        CosineModule,
    ],
    controllers: [ChatBotController, ChatBotAdminController],
    providers: [...scheduleProviders],
})
export class AppModule {}
