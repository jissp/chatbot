import { Module } from '@nestjs/common';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dataset } from '@libs/chat-bot/schemas/dataset';

@Module({
    imports: [TypeOrmModule.forFeature([Dataset])],
    providers: [ChatBotService],
    exports: [ChatBotService],
})
export class ChatBotModule {}
