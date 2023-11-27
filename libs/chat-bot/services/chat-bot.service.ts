import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from '@libs/chat-bot/schemas/dataset';
import { Repository } from 'typeorm';
import { hash } from '@libs/utils/hash.util';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class ChatBotService {
    constructor(
        @InjectRepository(Dataset)
        private readonly dataSetRepository: Repository<Dataset>,
    ) {}

    async findMany(where?: FindOptionsWhere<Dataset>) {
        return this.dataSetRepository.findBy(where);
    }

    async createDataSet(title: string, content: string) {
        return this.dataSetRepository.save({
            title: title,
            content: content,
            contentHash: hash(content),
        });
    }

    async updateDataSet(id: number, content: string) {
        return this.dataSetRepository.update(id, {
            content: content,
            contentHash: hash(content),
        });
    }

    async updateDataSetVectors({
        id,
        content,
        vectors,
        tokenCount,
    }: {
        id: number;
        content: string;
        vectors: number[];
        tokenCount: number;
    }) {
        return this.dataSetRepository.update(id, {
            vectors: vectors,
            vectorContentHash: hash(content),
            tokenCount: tokenCount,
            vectoredAt: new Date(),
        });
    }
}
