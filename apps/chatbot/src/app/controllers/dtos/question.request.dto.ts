import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QuestionRequestDto {
    @ApiProperty({
        description: '질문',
        example: '안녕하세요',
    })
    @IsString()
    question: string;
}
