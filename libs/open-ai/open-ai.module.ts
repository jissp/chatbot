import { Module } from '@nestjs/common';
import { ConfigModule } from '@libs/config/config.module';
import { ConfigService } from '@libs/config/services/config.service';
import { OpenAiService } from '@libs/open-ai/services/open-ai.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: OpenAiService,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new OpenAiService(configService.getOpenAiApiKey());
            },
        },
    ],
    exports: [OpenAiService],
})
export class OpenAiModule {}
