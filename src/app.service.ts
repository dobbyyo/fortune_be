import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from '@src/config/app.config';

@Injectable()
export class AppService {
  constructor(
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  getHello(): string {
    const host = this.config.host;
    const port = this.config.port;
    return `Hello Woㅇㅇㅇr되냐?ddld!!!! ${host}:${port}`;
  }
}
