import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "./Schemas/user.schema";
import { AdminSeederService } from "./Schemas/admin.seederservice";

@Module({
    imports: [
      MongooseModule.forFeature([{ name: User.name, schema: userSchema }]), // Connects the User model
    ],
    providers: [AdminSeederService], // Registers the AdminSeederService
    exports: [AdminSeederService],    // Export it if other modules need access
  })
  export class SeederModule {}