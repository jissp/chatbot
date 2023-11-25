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

    // async findSimilarityContent(content: string, vectors: number[]) {
    //     const contents = await this.contentRepository.findBy({
    //         vectorContentHash: Not(IsNull()),
    //     });
    //
    //
    //     return this.contentRepository.findOneBy({
    //         where: {
    //             vectors: vectors,
    //             vectorContentHash: hash(content),
    //         },
    //     });
    // }

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

    async updateContentVectors(id: number, content: string, vectors: number[]) {
        return this.contentRepository.update(id, {
            vectors: vectors,
            vectorContentHash: hash(content),
            vectoredAt: new Date(),
        });
    }
}
