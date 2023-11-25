import { Module } from '@nestjs/common';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '@libs/chat-bot/schemas/content';

@Module({
    imports: [TypeOrmModule.forFeature([Content])],
    providers: [ChatBotService],
    exports: [ChatBotService],
})
export class ChatBotModule {}
