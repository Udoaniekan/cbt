// import { Injectable, Logger } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import * as bcrypt from 'bcrypt';
// import { Admin } from './Schemas/admin.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class AdminSeederService {
//   private readonly logger = new Logger(AdminSeederService.name);

//   constructor( @InjectModel(Admin.name) private readonly AdminModel: Model<Admin>) {}

//   async seedAdmin() {
//     const adminFirstName = 'Matthew';
//     const adminLastName = 'Ebom';
//     const adminPassword = 'peter50k';
//     const adminEmail = 'matthew@gmail.com';

//     // Check if admin already exists
//     const adminExists = await this.AdminModel.findOne({email:adminEmail});
//     if (adminExists) {
//       this.logger.log('Admin user already exists. Skipping seeding.');
//       return;
//     }

//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(adminPassword, 10);
//     console.log('y')
//     // Create admin user
//     const saveAdmin = new this.AdminModel({
//       firstName: adminFirstName,
//       lastName: adminLastName,
//       password: hashedPassword, 
//       email: adminEmail,
//     });
//     await saveAdmin.save()
//     this.logger.log(`Admin user "${adminFirstName} ${adminLastName} " has been created.`);
//   }
// }
