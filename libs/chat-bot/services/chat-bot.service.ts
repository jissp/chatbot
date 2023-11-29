import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from '@libs/chat-bot/schemas/dataset';
import { Repository } from 'typeorm';
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
        });
    }

    async updateDataSet(id: number, content: string) {
        return this.dataSetRepository.update(id, {
            content: content,
        });
    }

    async updateDataSetVectors({
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

    async getDiffContentVectorList() {
        return this.dataSetRepository
            .createQueryBuilder()
            .where('vectored_at < updated_at')
            .getMany();
    }
}
