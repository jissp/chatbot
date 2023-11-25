import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private get(key: string): string {
        return process.env[key];
    }

    public getChatBotHeader(): string {
        return this.get('CHAT_BOT_HEADER');
    }

    public getOpenAiApiKey(): string {
        return this.get('OPENAI_API_KEY');
    }
}
