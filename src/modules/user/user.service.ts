import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './Schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.user';
import { UpdateRoleDto } from './dto/update.Dto';

@Injectable()
export class UserService {
  userModel: any;
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>, // User Model
    private jwtService: JwtService, // JWT service for token handling
  ) {}

  // User SignUp Logic
  async signUp(payload: CreateUserDto) {
    const { email, password, ...result } = payload;
    // Check if user already exists
    const user = await this.authModel.findOne({ email });

    if (user) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash the password before saving
    const newPassword = await bcrypt.hash(password, 10);

    try {
      const signUp = new this.authModel({ email, password: newPassword, ...result });
      await signUp.save();

      // Remove password before returning the user object
      const { password: _, ...userWithoutPassword } = signUp.toObject();

      return {
        message: 'User registered successfully',
        result: userWithoutPassword,
      };
    } catch (error) {
      // Handle error if saving user to database fails
      throw new Error('Error saving user to database: ' + error.message);
    }
  }

  // User LogIn Logic
  async logIn(payload: LoginDto) {
    const { email, password } = payload;

    // Check if user exists
    const findUser = await this.authModel.findOne({ email });
    if (!findUser) {
      throw new UnauthorizedException('Invalid email or password'); // Unified error message for better security
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password'); // Same unified message
    }

    // Token creation logic
    const tokenHolder = { email: findUser.email, userId: findUser._id, isBlocked: findUser.isBlocked };
    const accessToken = await this.jwtService.signAsync(tokenHolder);

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = findUser.toObject();

    return {
      msg: 'Login successful',
      user: userWithoutPassword,
      token: accessToken,
    };
  }

  async updateRole(userId: string, updateRoleDto: UpdateRoleDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Update the role
    user.role = updateRoleDto.role;
    await user.save();

    return { message: `User role updated to ${updateRoleDto.role}` };
  }

  async deleteUserByEmail(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOneAndDelete({ email }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return { message: 'User successfully deleted' };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}


