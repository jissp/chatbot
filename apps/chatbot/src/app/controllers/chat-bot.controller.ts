import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatBotGuard } from '@libs/common/guards/chatbot-guard';
import { QuestionRequestDto } from '@app/chatbot/src/app/controllers/dtos/question.request.dto';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';
import { CosineService } from '@libs/cosine/services/cosine.service';
import * as _ from 'lodash';

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
        const contents = await this.chatBotService.findVectors();
        const embeddings = await this.openAiService.crateEmbedding(
            query.question,
        );

        const questionVector = embeddings.data[0].embedding;

        const similarityContents = contents.map((content) => {
            const similarity = this.cosineService.similarity(
                questionVector,
                content.vectors,
            );

            return {
                id: content.id,
                similarity,
            };
        });

        const topSimilarityContent = _.sortBy(
            similarityContents,
            'similarity',
        ).reverse();

        const firstSimilarityContent = topSimilarityContent[0];
        const content = await this.chatBotService.getContentById(
            firstSimilarityContent.id,
        );

        const response = await this.openAiService.question(
            query.question,
            content.content,
        );

        return response.choices[0].message.content;
    }
}
