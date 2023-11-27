import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';
import { QuestionRequestDto } from '@app/chatbot/src/app/controllers/dtos/question.request.dto';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';
import { CosineService } from '@libs/cosine/services/cosine.service';
import * as _ from 'lodash';
import { IsNull, Not } from 'typeorm';

@UseGuards(ChatBotGuard)
@Controller()
export class ChatBotController {
    constructor(
        private readonly chatBotService: ChatBotService,
        private readonly cosineService: CosineService,
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
            vectorContentHash: Not(IsNull()),
        });

        // 질문을 OpenAI API 를 통해서 Vector 로 변환
        const embedding = await this.openAiService.crateEmbedding(
            query.question,
        );

        // 유사도 계산
        const dataSetSimilarities = dataSets.map((dataSet) => {
            return {
                id: dataSet.id,
                similarity: this.cosineService.similarity(
                    embedding.vector,
                    dataSet.vectors,
                ),
            };
        });

        // 유사도를 내림차순으로 정렬
        const sortedSimilarityDataSets = _.sortBy(
            dataSetSimilarities,
            'similarity',
        ).reverse();

        // 유사도가 높은 순으로 n개의 데이터를 컨텍스트로 사용
        const tokenLimit = 0;
        const dataSetMap = _.keyBy(dataSets, 'id');
        const similarityDataSetInfos = sortedSimilarityDataSets.reduce(
            (acc, cur) => {
                const content = dataSetMap[cur.id];

                const isPush =
                    acc.tokenCount + content.tokenCount < tokenLimit ||
                    acc.content.length === 0;

                if (isPush) {
                    acc.tokenCount += content.tokenCount;
                    acc.content.push(content.content);
                }

                return acc;
            },
            { content: [], tokenCount: 0 } as {
                content: string[];
                tokenCount: number;
            },
        );

        // OpenAI API 를 통해서 답변을 응답
        return await this.openAiService.question(
            query.question,
            similarityDataSetInfos.content.join('\n'),
        );
    }
}
