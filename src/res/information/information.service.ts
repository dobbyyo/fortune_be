import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebInformationEntity } from './entities/web_information.entity';
import { Repository } from 'typeorm';
import { GetInformationDto } from './dto/get-information.dto';
import isValidDate from '@/src/utils/valid-date.util';

@Injectable()
export class InformationService {
  constructor(
    @InjectRepository(WebInformationEntity)
    private readonly webInformationRepository: Repository<WebInformationEntity>,
  ) {}

  // 공지사항 가져오기
  async getInformation(query: GetInformationDto) {
    const { start_date, end_date, page = 1, limit = 10 } = query;

    // 유효성 검사
    if (start_date && !isValidDate(start_date)) {
      throw new BadRequestException('Invalid start_date format');
    }
    if (end_date && !isValidDate(end_date)) {
      throw new BadRequestException('Invalid end_date format');
    }

    const queryBuilder =
      this.webInformationRepository.createQueryBuilder('info');

    if (start_date) {
      queryBuilder.andWhere('info.created_at >= :start_date', { start_date });
    }
    if (end_date) {
      queryBuilder.andWhere('info.created_at <= :end_date', { end_date });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const information = await queryBuilder.getMany();
    return { information };
  }
}
