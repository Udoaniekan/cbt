// admin-seeder.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema'; // Adjust the import path as necessary
import { UserRole } from '../enum/enum.user';

@Injectable()
export class AdminSeederService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async seedAdmin() {
    const adminExists = await this.userModel.findOne({ email: 'danny@example.com' });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('adminPassword', 10);
    const adminUser = new this.userModel({
      firstName: 'Danny',
      lastName: 'Ekong',
      email: 'danny@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN, // Set the role to ADMIN
    }); 
    

    await adminUser.save();
    console.log('Admin user created.');
  }
}
