import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey,
        });
    }

    async crateEmbedding(input: string) {
        return this.client.embeddings.create({
            input,
            model: 'text-embedding-ada-002',
        });
    }

    async question(question: string, content: string) {
        return this.client.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            messages: [
                {
                    role: 'system',
                    content: `${content} \n 위 컨텐츠를 기반으로 아래의 질문을 답변해 줘. 위 컨텍스트와 상관없는 질문이라면 '제가 잘 모르는 질문이에요.' 라고 그대로 답변해 줘`,
                },
                { role: 'user', content: question },
            ],
        });
    }
}
