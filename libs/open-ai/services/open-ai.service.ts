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

    /**
     * 문자열을 Vector 로 변환하는 API 를 호출한다.
     * @param input
     */
    async crateEmbedding(input: string) {
        const response = await this.client.embeddings.create({
            input,
            model: 'text-embedding-ada-002',
        });

        return {
            vector: response.data[0].embedding,
            tokens: response.usage.total_tokens,
        };
    }

    /**
     * OpenAI TextGeneration API 를 호출한다.
     * @param question
     * @param content
     */
    async question(question: string, content: string) {
        const response = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            messages: [
                {
                    role: 'system',
                    content: `${content} \n 위 컨텍스트를 기반으로 아래의 질문에 필요한 부분만 답변해 줘. 관련없는 내용이라면 '제가 잘 모르는 질문이에요.' 라고 답변해 줘`,
                },
                { role: 'user', content: question },
            ],
        });

        return response.choices[0].message.content;
    }
}
