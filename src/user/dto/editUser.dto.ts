import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class EditUserDto {
  @IsString()
  @Length(4)
  @IsOptional()
  readonly username?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @Length(10)
  @IsOptional()
  readonly password?: string;
}
