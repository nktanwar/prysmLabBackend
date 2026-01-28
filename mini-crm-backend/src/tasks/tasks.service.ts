import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const assignedUser = await this.prisma.user.findUnique({
      where: { id: dto.assignedTo },
    });

    if (!assignedUser || assignedUser.role !== Role.EMPLOYEE) {
      throw new NotFoundException('Assigned user must be an EMPLOYEE');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        assignedToId: dto.assignedTo,
        customerId: dto.customerId,
      },
    });
  }

  async findAll(userId: number, role: Role) {
    const where =
      role === Role.ADMIN
        ? {}
        : { assignedToId: userId };

    return this.prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    taskId: number,
    dto: UpdateTaskStatusDto,
    userId: number,
    role: Role,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role === Role.EMPLOYEE && task.assignedToId !== userId) {
      throw new ForbiddenException(
        'You can update only your assigned tasks',
      );
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: dto.status },
    });
  }
}
