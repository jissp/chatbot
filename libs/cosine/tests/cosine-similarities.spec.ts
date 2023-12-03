import { Test } from '@nestjs/testing';
import { CosineModule } from '@libs/cosine/cosine.module';

import * as question from './vectors/question.vector.json';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@libs/config/config.module';
import { ConfigService } from '@libs/config/services/config.service';
import { Dataset } from '@libs/chat-bot/schemas/dataset';
import { ChatBotService } from '@libs/chat-bot/services/chat-bot.service';
import { ChatBotModule } from '@libs/chat-bot/chat-bot.module';

describe('CosineSimilarities', () => {
    const percentageLimit = 97;

    let chatBotService: ChatBotService;

    let dataSets: Dataset[];

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) =>
                        configService.getDatabaseConfig(),
                }),
                ChatBotModule,
                CosineModule,
            ],
        }).compile();

        chatBotService = module.get<ChatBotService>(ChatBotService);

        dataSets = await chatBotService.findMany();
    });

    it('맛집 추천 해줘 비교', () => {
        const vector1 = question['맛집 추천 해줘'].vector;

        const dataSetSimilarities = chatBotService.calculateSimilarity({
            vector: vector1,
            dataSets,
            isReverseSort: true,
        });

        // 근사치 뽑아내기
        const filteredDataSets =
            chatBotService.filterSimilarityDataSetByPercentage({
                dataSetSimilarity: dataSetSimilarities[0],
                dataSetSimilarities: dataSetSimilarities,
                similarityPercentage: percentageLimit,
            });

        console.log(filteredDataSets);
    });

    it('헬스장 추천 해줘 비교', () => {
        const vector1 = question['헬스장 추천 해줘'].vector;

        const dataSetSimilarities = chatBotService.calculateSimilarity({
            vector: vector1,
            dataSets,
            isReverseSort: true,
        });

        // 근사치 뽑아내기
        const filteredDataSets =
            chatBotService.filterSimilarityDataSetByPercentage({
                dataSetSimilarity: dataSetSimilarities[0],
                dataSetSimilarities: dataSetSimilarities,
                similarityPercentage: percentageLimit,
            });

        console.log(filteredDataSets);
    });

    it('주차장 정보 알려줘 비교', () => {
        const vector1 = question['주차장 정보 알려줘'].vector;

        const dataSetSimilarities = chatBotService.calculateSimilarity({
            vector: vector1,
            dataSets,
            isReverseSort: true,
        });

        // 근사치 뽑아내기
        const filteredDataSets =
            chatBotService.filterSimilarityDataSetByPercentage({
                dataSetSimilarity: dataSetSimilarities[0],
                dataSetSimilarities: dataSetSimilarities,
                similarityPercentage: percentageLimit,
            });

        console.log(filteredDataSets);
    });

    it('오피스텔 상가 정보 알려줘', () => {
        const vector1 = question['오피스텔 상가 정보 알려줘'].vector;

        const dataSetSimilarities = chatBotService.calculateSimilarity({
            vector: vector1,
            dataSets,
            isReverseSort: true,
        });

        // 근사치 뽑아내기
        const filteredDataSets =
            chatBotService.filterSimilarityDataSetByPercentage({
                dataSetSimilarity: dataSetSimilarities[0],
                dataSetSimilarities: dataSetSimilarities,
                similarityPercentage: percentageLimit,
            });

        console.log(filteredDataSets);
    });
});
