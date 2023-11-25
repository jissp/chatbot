import { Module } from '@nestjs/common';
import { ConfigService } from '@libs/config/services/config.service';

@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
