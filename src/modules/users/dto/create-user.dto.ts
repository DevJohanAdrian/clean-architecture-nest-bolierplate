import { IsNotEmpty, MinLength, IsOptional, IsString , IsEmail} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

//generar seralizacion con class-tramsfor
export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  // @IsOptional()
  // @IsString()
  // roleCode?: string;
}
