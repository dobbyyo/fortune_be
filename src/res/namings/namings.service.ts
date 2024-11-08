import { Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NamingEntity } from './entities/naming.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedNamingEntity } from './entities/saved_naming.entity';
import { OpenaiService } from '../openai/openai.service';

@ApiTags('Namings')
@Injectable()
export class NamingsService {
  constructor(
    @InjectRepository(NamingEntity)
    private readonly tarotCardsRepository: Repository<NamingEntity>,
    @InjectRepository(SavedNamingEntity)
    private readonly savedUserTarotCardsRepository: Repository<SavedNamingEntity>,
    private readonly openaiService: OpenaiService,
  ) {}

  async drawNaming(mainTitle: string, content: string) {
    const naming = await this.openaiService.getNaming(mainTitle, content);
    return { naming };
  }
}
