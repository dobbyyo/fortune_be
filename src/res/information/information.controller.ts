import { Controller, Get, Query } from '@nestjs/common';
import { InformationService } from './information.service';

import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import { createResponse } from '@/src/utils/create-response.util';
import { ApiTags } from '@nestjs/swagger';
import { GetInformationDto } from './dto/get-information.dto';

@ApiTags('Information')
@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @CsrfHeaders('공지사항 가져오기')
  @Get('getInformation')
  async getInformation(@Query() query: GetInformationDto) {
    const information = await this.informationService.getInformation(query);
    return createResponse(200, 'successful', information);
  }
}
