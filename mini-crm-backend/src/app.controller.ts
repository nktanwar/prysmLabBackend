import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Roles } from './common/decorators/roles.decorator';
import { Role } from './common/enums/role.enum';
import { RolesGuard } from './common/guards/roles.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-only')
  adminOnly(@Req() req) {
    return {
      message: 'Welcome ADMIN',
      user: req.user,
    };
  }
}
