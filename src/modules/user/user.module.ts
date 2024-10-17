import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './Schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name, schema:userSchema}]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { 
        expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
        algorithm:configService.getOrThrow('JWT_ALGORITHM')
       },
        
      }),
    }),
    PassportModule.register({
      defaultStrategy:'jwt',
      session:true
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
