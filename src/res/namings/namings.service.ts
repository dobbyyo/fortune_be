import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly namingRepository: Repository<NamingEntity>,
    @InjectRepository(SavedNamingEntity)
    private readonly savedNamingRepository: Repository<SavedNamingEntity>,
    private readonly openaiService: OpenaiService,
  ) {}

  // 작명 추천
  async drawNaming(mainTitle: string, content: string) {
    const naming = await this.openaiService.getNaming(mainTitle, content);
    return { naming };
  }

  // 작명 저장
  async saveNaming(
    userId: number,
    mainTitle: string,
    namings: { name: string; description: string }[],
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let namingEntity = await this.namingRepository.findOne({
      where: { mainTitle, date: today },
    });

    if (!namingEntity) {
      namingEntity = this.namingRepository.create({
        mainTitle,
        date: today,
      });
      namingEntity = await this.namingRepository.save(namingEntity);
    }

    const savedNamings = await Promise.all(
      namings.map(async (naming) => {
        const savedNaming = this.savedNamingRepository.create({
          name: naming.name,
          description: naming.description,
          naming: namingEntity,
          user: { id: userId },
        });
        return await this.savedNamingRepository.save(savedNaming);
      }),
    );

    return { savedNamings };
  }

  // 작명 저장 취소
  async cancelSavedNaming(
    userId: number,
    savedNamingId: number,
  ): Promise<string> {
    const savedNaming = await this.savedNamingRepository.findOne({
      where: { id: savedNamingId, user: { id: userId } },
    });

    if (!savedNaming) {
      throw new NotFoundException(`${savedNamingId}를 찾을 수 없습니다.`);
    }

    const namingId = savedNaming.id;

    await this.savedNamingRepository.remove(savedNaming);

    const otherReferences = await this.savedNamingRepository.findOne({
      where: { naming: { id: namingId } },
    });

    if (!otherReferences) {
      await this.namingRepository.delete(namingId);
    }

    return 'Successful';
  }
}
