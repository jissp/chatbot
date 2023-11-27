import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';
import { CreateDataSetRequestDto } from '@app/chatbot/src/app/controllers/dtos/create-data-set.request.dto';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';

@UseGuards(ChatBotGuard)
@Controller('admin')
export class ChatBotAdminController {
    constructor(
        private readonly chatBotService: ChatBotService,
        private readonly openAiService: OpenAiService,
    ) {}

    @ApiOperation({
        operationId: 'Chatbot.CreateDataSet',
        description: '데이터를 추가합니다.',
    })
    @Post('dataSet')
    async createDataSet(@Body() body: CreateDataSetRequestDto) {
        //
        const dataSet = await this.chatBotService.createDataSet(
            body.title,
            body.content,
        );

        const embedding = await this.openAiService.crateEmbedding(body.content);

        await this.chatBotService.updateDataSetVectors({
            id: dataSet.id,
            content: body.content,
            vectors: embedding.vector,
            tokenCount: embedding.tokens,
        });

        return dataSet.id;
    }
}
