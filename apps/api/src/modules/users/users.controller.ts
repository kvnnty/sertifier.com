import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(+page, +limit);
  }

  @Get('me')
  async getCurrentUser(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    return user;
  }

  @Get(':id')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/reactivate')
  reactivate(@Param('id') id: string) {
    // return this.usersService.reactivate(id);
  }

  @Get(':id/organizations')
  getUserOrganizations(@Param('id') id: string) {
    // This would call organizationsService.getUserOrganizations(id)
    // You'll need to inject OrganizationsService or create this method in UsersService
    return { message: 'Implementation needed - inject OrganizationsService' };
  }
}
