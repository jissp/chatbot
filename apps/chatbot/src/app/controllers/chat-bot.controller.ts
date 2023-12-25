import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';
import { QuestionRequestDto } from '@app/chatbot/src/app/controllers/dtos/question.request.dto';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';
import { IsNull, Not } from 'typeorm';

@UseGuards(ChatBotGuard)
@Controller()
export class ChatBotController {
    constructor(
        private readonly chatBotService: ChatBotService,
        private readonly openAiService: OpenAiService,
    ) {}

    @ApiOperation({
        operationId: 'Chatbot.Question',
        description: '챗봇에게 질문을 합니다.',
    })
    @Get('question')
    async question(@Query() query: QuestionRequestDto) {
        // DataSet 전체 조회
        const dataSets = await this.chatBotService.findMany({
            vectoredAt: Not(IsNull()),
        });

        // OpenAI API 를 통해서 질문을 Vector 로 변환
        const embedding = await this.openAiService.embedding(query.question);

        // 유사도 계산
        const dataSetSimilarities = this.chatBotService.calculateSimilarity({
            vector: embedding.vector,
            dataSets: dataSets,
            isReverseSort: true,
        });

        // 유사도가 비슷한 데이터 조회
        const filteredDataSetSimilarities =
            this.chatBotService.filterSimilarityDataSetByPercentage({
                dataSetSimilarity: dataSetSimilarities[0],
                dataSetSimilarities: dataSetSimilarities,
                similarityPercentage: 97.0,
            });

        // n개 미만의 토큰 수까지 컨텍스트로 사용
        const context = this.chatBotService.buildDataSetContext({
            dataSetSimilarities: filteredDataSetSimilarities,
            dataSets,
            tokenLimit: 2500,
        });

        // OpenAI API 를 통해서 답변을 응답
        return await this.openAiService.question(query.question, context);
    }
}
