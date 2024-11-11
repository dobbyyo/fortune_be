import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../res/redis/redis.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    if (!activate) {
      throw new UnauthorizedException('Authentication failed');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const token = request.get('authorization')?.replace('Bearer ', '');
    // Redis에서 토큰을 가져와서 검증
    const redisToken = await this.redisService.get(`token:${user.userId}`);
    if (!redisToken || redisToken !== token) {
      throw new UnauthorizedException('Invalid token or session expired');
    }

    return activate;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }
    return user;
  }
}
