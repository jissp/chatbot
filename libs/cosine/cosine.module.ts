import { Module } from '@nestjs/common';
import { CosineService } from '@libs/cosine/services/cosine.service';

@Module({
    providers: [CosineService],
    exports: [CosineService],
})
export class CosineModule {}
