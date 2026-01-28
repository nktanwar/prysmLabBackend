import { IsEnum, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsInt()
  assignedTo: number;

  @IsInt()
  customerId: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
