import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class ConfigService {
    private get(key: string): string | null {
        return process.env[key] ?? null;
    }

    public getOpenAiApiKey(): string {
        return this.get('OPENAI_API_KEY');
    }

    async getDatabaseConfig(): Promise<TypeOrmModuleOptions> {
        return {
            type: 'mysql',
            host: this.get('database_host'),
            port: Number(this.get('database_port')),
            database: this.get('database_collection'),
            username: this.get('database_user'),
            password: this.get('database_password'),
            synchronize: false,
            autoLoadEntities: true,
            extra: {
                decimalNumbers: true,
            },
            namingStrategy: new SnakeNamingStrategy(),
        };
    }
}
