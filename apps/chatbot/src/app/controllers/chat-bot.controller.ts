import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';
import { QuestionRequestDto } from '@app/chatbot/src/app/controllers/dtos/question.request.dto';

@UseGuards(ChatBotGuard)
@Controller()
export class ChatBotController {
    @ApiOperation({
        operationId: 'Chatbot.Question',
        description: '챗봇에게 질문을 합니다.',
    })
    @Get('question')
    async question(@Query() query: QuestionRequestDto) {
        console.log(query);
    }
}
