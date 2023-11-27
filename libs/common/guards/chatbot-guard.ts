import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@libs/config/services/config.service';
import { CHAT_BOT_HEADER_KEY } from '@libs/common/interfaces/header.interface';

@Injectable()
export class ChatBotGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        return (
            request.headers[CHAT_BOT_HEADER_KEY] ===
            this.configService.getChatBotHeader()
        );
    }
}
