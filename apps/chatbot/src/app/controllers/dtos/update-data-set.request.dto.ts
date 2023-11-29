import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateDataSetRequestDto {
    @ApiProperty({
        description: 'OpenAI가 참고할 수 있는 데이터',
        example: '여기 주변의 맛집은 ...... 입니다.',
    })
    @IsString()
    content: string;
}
