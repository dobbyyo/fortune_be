import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@res/users/entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findByEmail(email: string): Promise<Users | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(userDto: Partial<Users>): Promise<Users> {
    // 필요한 필드가 userDto에 포함되어 있는지 확인 후 객체 생성
    const newUser = this.userRepository.create(userDto); // 단일 객체 생성
    return await this.userRepository.save(newUser); // 단일 객체 저장
  }
}
