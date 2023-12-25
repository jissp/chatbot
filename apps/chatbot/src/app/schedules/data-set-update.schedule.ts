import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';

@Injectable()
export class DataSetUpdateSchedule {
    constructor(
        private readonly chatBotService: ChatBotService,
        private readonly openAiService: OpenAiService,
    ) {}

    @Cron('0 * * * * *')
    async handle() {
        console.log('run DataSetUpdateSchedule.handle');
        const dataSets = await this.chatBotService.getDiffContentVectorList();

        if (dataSets.length === 0) {
            return;
        }

        console.log(`Update DataSet Count: ${dataSets.length}`);

        const result = await Promise.allSettled(
            dataSets.map(async (dataSet) => {
                const embedding = await this.openAiService.embedding(
                    dataSet.content,
                );

                return this.chatBotService.updateDataSetVectors({
                    id: dataSet.id,
                    vectors: embedding.vector,
                    tokenCount: embedding.tokens,
                });
            }),
        );

        console.log(result);
    }
}
