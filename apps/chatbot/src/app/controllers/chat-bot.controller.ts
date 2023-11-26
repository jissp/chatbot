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
        const contents = await this.chatBotService.findMany({
            vectorContentHash: Not(IsNull()),
        });

        const contentMap = _.keyBy(contents, 'id');
        const embeddings = await this.openAiService.crateEmbedding(
            query.question,
        );

        const questionVector = embeddings.data[0].embedding;

        const contentSimilarities = contents.map((content) => {
            const similarity = this.cosineService.similarity(
                questionVector,
                content.vectors,
            );

            return {
                id: content.id,
                similarity,
            };
        });

        const sortedSimilarityContents = _.sortBy(
            contentSimilarities,
            'similarity',
        ).reverse();

        const tokenLimit = 0;

        const similarityContentInfo = sortedSimilarityContents.reduce(
            (acc, cur) => {
                const content = contentMap[cur.id];
                const token = content.tokenCount;

                if (
                    acc.tokenCount + token < tokenLimit ||
                    acc.content.length === 0
                ) {
                    acc.tokenCount += token;
                    acc.content.push(content.content);
                }

                return acc;
            },
            { content: [], tokenCount: 0 } as {
                content: string[];
                tokenCount: number;
            },
        );

        const response = await this.openAiService.question(
            query.question,
            similarityContentInfo.content.join('\n'),
        );

        return response.choices[0].message.content;
    }
}
