import { Module } from '@nestjs/common';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';

@Module({
    providers: [ChatBotService],
    exports: [ChatBotService],
})
export class ChatBotModule {}
