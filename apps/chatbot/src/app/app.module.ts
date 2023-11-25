import { Module } from '@nestjs/common';
import { ChatBotController } from '@app/chatbot/src/app/controllers/chat-bot.controller';
import { ConfigModule } from '@libs/config/config.module';

@Module({
    imports: [ConfigModule],
    controllers: [ChatBotController],
    providers: [],
})
export class AppModule {}
