import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FortunesService } from '@res/fortunes/fortunes.service';
import { Request } from 'express';
import { DrawSandbarDto } from './dto/draw-sandbar.dto';
import { createResponse } from '@/src/utils/create-response.util';

@ApiTags('fortunes')
@Controller('fortunes')
export class FortunesController {
  constructor(private readonly fortunesService: FortunesService) {}

  @AuthAndCsrfHeaders('운세 저장')
  @UseGuards(JwtAuthGuard)
  @Get('sandbar')
  async getSaiju(
    @Query() drawSandbarDto: DrawSandbarDto, // 양력 or 음력
    @Req() req: Request,
  ) {
    const userData = req.user;
    const sandbarData = await this.fortunesService.getSandbar(
      userData,
      drawSandbarDto,
    );

    return createResponse(200, 'successful', sandbarData);
  }
}
