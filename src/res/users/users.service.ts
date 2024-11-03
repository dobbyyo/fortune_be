import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async findByEmail(email: string): Promise<UsersEntity | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(userDto: Partial<UsersEntity>): Promise<UsersEntity> {
    // 필요한 필드가 userDto에 포함되어 있는지 확인 후 객체 생성
    const newUser = this.userRepository.create(userDto); // 단일 객체 생성
    return await this.userRepository.save(newUser); // 단일 객체 저장
  }
}
