import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';
import { CreateContentRequestDto } from '@app/chatbot/src/app/controllers/dtos/create-content.request.dto';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';

@UseGuards(ChatBotGuard)
@Controller('admin')
export class ChatBotAdminController {
    constructor(
        private readonly chatBotService: ChatBotService,
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

        await this.chatBotService.updateContentVectors({
            id: content.id,
            content: body.content,
            vectors: vector,
            tokenCount: embedding.usage.total_tokens,
        });

        return content.id;
    }
}
