import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';
import { CreateDataSetRequestDto } from '@app/chatbot/src/app/controllers/dtos/create-data-set.request.dto';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';
import { UpdateDataSetRequestDto } from '@app/chatbot/src/app/controllers/dtos/update-data-set.request.dto';

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

        return dataSet.id;
    }

    @ApiOperation({
        operationId: 'Chatbot.updateDataSet',
        description: '데이터를 수정합니다.',
    })
    @Put('dataSet/:id')
    async updateDataSet(
        @Param('id') id: number,
        @Body() body: UpdateDataSetRequestDto,
    ) {
        //
        const result = await this.chatBotService.updateDataSet(
            id,
            body.content,
        );

        return id;
    }
}
