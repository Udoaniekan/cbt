import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederModule } from './modules/user/admin.seedermodule';
import { AdminSeederService } from './modules/user/Schemas/admin.seederservice';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule, SeederModule
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly AdminSeederService:AdminSeederService) {}

  async onModuleInit() {
    // Call the seedAdmin function to insert admin if not present
    await this.AdminSeederService.seedAdmin();
  }
}

// export class AppModule {}
