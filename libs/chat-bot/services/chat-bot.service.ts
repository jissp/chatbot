import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from '@libs/chat-bot/schemas/dataset';
import { Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import * as _ from 'lodash';
import { CosineService } from '@libs/cosine/services/cosine.service';

export interface SimilarityDataSet {
    id: number;
    similarity: number;
}

@Injectable()
export class ChatBotService {
    constructor(
        @InjectRepository(Dataset)
        private readonly dataSetRepository: Repository<Dataset>,
        private readonly cosineService: CosineService,
    ) {}

    public async findMany(where?: FindOptionsWhere<Dataset>) {
        return this.dataSetRepository.findBy(where);
    }

    public async createDataSet(title: string, content: string) {
        return this.dataSetRepository.save({
            title: title,
            content: content,
        });
    }

    public async updateDataSet(id: number, content: string) {
        return this.dataSetRepository.update(id, {
            content: content,
        });
    }

    public async updateDataSetVectors({
        id,
        vectors,
        tokenCount,
    }: {
        id: number;
        vectors: number[];
        tokenCount: number;
    }) {
        return this.dataSetRepository.update(id, {
            vector: vectors,
            tokenCount: tokenCount,
            vectoredAt: new Date(),
        });
    }

    public async getDiffContentVectorList() {
        return this.dataSetRepository
            .createQueryBuilder()
            .where('vectored_at < updated_at')
            .orWhere('vectored_at IS NULL')
            .getMany();
    }

    /**
     *
     * @param vector
     * @param dataSets
     * @param isReverseSort
     */
    public calculateSimilarity({
        vector,
        dataSets,
        isReverseSort = false,
    }: {
        vector: number[];
        dataSets: Dataset[];
        isReverseSort?: boolean;
    }) {
        // 유사도 계산
        let sortedSimilarityDataSets = _.sortBy(
            dataSets.map((dataSet): SimilarityDataSet => {
                return {
                    id: dataSet.id,
                    similarity: this.cosineService.similarity(
                        vector,
                        dataSet.vector,
                    ),
                };
            }),
            'similarity',
        );

        // 유사도를 내림차순으로 정렬
        if (isReverseSort) {
            sortedSimilarityDataSets = sortedSimilarityDataSets.reverse();
        }

        return sortedSimilarityDataSets;
    }

    /**
     * 대상 데이터를 기준으로 유사도가 비슷한 데이터를 뽑아냅니다.
     *
     * @param dataSetSimilarity
     * @param dataSetSimilarities
     * @param similarityPercentage
     */
    public filterSimilarityDataSetByPercentage({
        dataSetSimilarity,
        dataSetSimilarities,
        similarityPercentage = 97.0,
    }: {
        dataSetSimilarity: SimilarityDataSet;
        dataSetSimilarities: SimilarityDataSet[];
        similarityPercentage: number;
    }) {
        // 근사한 데이터 뽑아내기
        return dataSetSimilarities.filter((dataSet) => {
            const percentage =
                (dataSet.similarity / dataSetSimilarity.similarity) * 100;

            return percentage >= similarityPercentage;
        });
    }

    public buildDataSetContext({
        dataSetSimilarities,
        dataSets,
        tokenLimit = 0,
    }: {
        dataSetSimilarities: SimilarityDataSet[];
        dataSets: Dataset[];
        tokenLimit: number;
    }) {
        const dataSetMap = _.keyBy(dataSets, 'id');

        return dataSetSimilarities
            .reduce(
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
            )
            .content.join('\n');
    }
}
