import { Injectable } from '@nestjs/common';
import { SandbarEntity } from './entities/sandbar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenaiService } from '../openai/openai.service';
import { DrawSandbarDto } from './dto/draw-sandbar.dto';
import { UserResponse } from '../auth/types/user.type';
// import { DrawSandbarDto } from './dto/draw-sandbar.dto';

@Injectable()
export class FortunesService {
  constructor(
    @InjectRepository(SandbarEntity)
    private readonly sandbarRepository: Repository<SandbarEntity>,
    private readonly openaiService: OpenaiService,
  ) {}

  async getSandbar(userData: UserResponse, drawSandbarDto: DrawSandbarDto) {
    const sandbarData = await this.openaiService.getSandbar(
      userData,
      drawSandbarDto,
    );
    return { sandbarData };
  }
}
