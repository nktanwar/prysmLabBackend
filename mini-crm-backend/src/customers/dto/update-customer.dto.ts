import { IsEmail, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  company?: string;
}
