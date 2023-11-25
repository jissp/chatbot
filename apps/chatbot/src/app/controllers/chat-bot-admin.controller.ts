import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';
import { CosineService } from '@libs/cosine/services/cosine.service';
import { CreateContentRequestDto } from '@app/chatbot/src/app/controllers/dtos/create-content.request.dto';

@Controller('admin')
export class ChatBotAdminController {
    constructor(
        private readonly chatBotService: ChatBotService,
        private readonly cosineService: CosineService,
        private readonly openAiService: OpenAiService,
    ) {}

    @ApiOperation({
        operationId: 'Chatbot.CreateContent',
        description: '데이터를 추가합니다.',
    })
    @Post('content')
    async createContent(@Body() body: CreateContentRequestDto) {
        const content = await this.chatBotService.createContent(
            body.title,
            body.content,
        );

        const embedding = await this.openAiService.crateEmbedding(body.content);
        const vector = embedding.data[0].embedding;

        await this.chatBotService.updateContentVectors(
            content.id,
            body.content,
            vector,
        );

        return content.id;
    }
}
