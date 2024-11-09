import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedDreamInterpretationEntity } from './entities/saved_dream_interpretation.entity';
import { Repository } from 'typeorm';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class DreamsService {
  constructor(
    @InjectRepository(SavedDreamInterpretationEntity)
    private readonly savedDreamInterpretationRepository: Repository<SavedDreamInterpretationEntity>,
    private readonly openaiService: OpenaiService,
  ) {}

  async interpretDream(title: string, description: string) {
    const interpretation = await this.openaiService.getDreamInterpretation(
      title,
      description,
    );
    return { interpretation };
  }
}
