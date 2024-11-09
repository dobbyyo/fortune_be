import { Injectable, NotFoundException } from '@nestjs/common';
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

  // 꿈해몽 해석
  async interpretDream(title: string, description: string) {
    const interpretation = await this.openaiService.getDreamInterpretation(
      title,
      description,
    );
    return { interpretation };
  }

  // 꿈해몽 저장
  async saveInterpretedDream(
    userId: number,
    mainTitle: string,
    user_description: string,
    ai_interpretation: string,
  ) {
    const savedDreamInterpretation =
      this.savedDreamInterpretationRepository.create({
        title: mainTitle,
        user_description,
        description: ai_interpretation,
        user: { id: userId },
      });

    await this.savedDreamInterpretationRepository.save(
      savedDreamInterpretation,
    );

    return { savedDreamInterpretation };
  }

  // 꿈해몽 저장 취소
  async cancelSavedDreamInterpretation(
    userId: number,
    savedDreamInterpretationId: number,
  ) {
    const savedDreamInterpretation =
      await this.savedDreamInterpretationRepository.findOne({
        where: { id: savedDreamInterpretationId, user: { id: userId } },
      });

    if (!savedDreamInterpretation) {
      throw new NotFoundException('해당 저장된 해몽이 없습니다.');
    }

    await this.savedDreamInterpretationRepository.remove(
      savedDreamInterpretation,
    );

    return { savedDreamInterpretation };
  }
}
