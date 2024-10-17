import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.user';
import { UserGuard } from '../../common/guards/user.guards';
import { RolesGuard } from 'src/common/guards/rolesGuard';
import { Roles } from 'src/common/guards/roles';
import { UserRole } from './enum/enum.user';
import { UpdateRoleDto } from './dto/update.Dto';
import { User } from './Schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('login')
  logIn(@Body() createUserDto: LoginDto) {
    return this.userService.logIn(createUserDto);
  }

  @Patch('update-role/:userId')
  @UseGuards(RolesGuard, UserGuard)
  @Roles(UserRole.ADMIN) // Only admins can update roles
  async updateRole(@Param('userId') userId: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.userService.updateRole(userId, updateRoleDto);
  }

  @Get(':email')
  @UseGuards(RolesGuard, UserGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) // Only admins & Instructors can get user by email
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }
  
  @Delete('/email/:email')
  @UseGuards(RolesGuard, UserGuard)
  @Roles(UserRole.ADMIN) 
  async deleteUserByEmail(@Param('email') email: string) {
  return this.userService.deleteUserByEmail(email);
  }
  
  @UseGuards(UserGuard)
  @Get('hello')
  hello() {
    return 'Hello World!';
  }
}
