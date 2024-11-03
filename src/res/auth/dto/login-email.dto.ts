import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginEmailDto {
  @ApiProperty({ example: 'do@gmail.com', description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
