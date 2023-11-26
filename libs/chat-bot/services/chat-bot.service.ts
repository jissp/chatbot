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
        private readonly contentRepository: Repository<Dataset>,
    ) {}

    async findMany(where?: FindOptionsWhere<Dataset>) {
        return this.contentRepository.findBy(where);
    }

    async createContent(title: string, content: string) {
        return this.contentRepository.save({
            title: title,
            content: content,
            contentHash: hash(content),
        });
    }

    async updateContent(id: number, content: string) {
        return this.contentRepository.update(id, {
            content: content,
            contentHash: hash(content),
        });
    }

    async updateContentVectors({
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
        return this.contentRepository.update(id, {
            vectors: vectors,
            vectorContentHash: hash(content),
            tokenCount: tokenCount,
            vectoredAt: new Date(),
        });
    }
}
