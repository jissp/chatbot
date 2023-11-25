import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '@libs/chat-bot/schemas/content';
import { IsNull, Not, Repository } from 'typeorm';
import { hash } from '@libs/utils/hash.util';

@Injectable()
export class ChatBotService {
    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) {}

    async findVectors() {
        return this.contentRepository.find({
            select: ['id', 'vectors'],
            where: {
                vectoredAt: Not(IsNull()),
            },
        });
    }

    async getContentById(id: number) {
        return this.contentRepository.findOneBy({
            id,
        });
    }

    async updateContent(id: number, content: string) {
        return this.contentRepository.update(id, {
            content: content,
            contentHash: hash(content),
        });
    }

    async updateContentVectors(id: number, content: string, vectors: number[]) {
        return this.contentRepository.update(id, {
            vectors: vectors,
            vectorContentHash: hash(content),
            vectoredAt: new Date(),
        });
    }
}
