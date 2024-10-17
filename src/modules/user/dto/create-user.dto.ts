import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(35)
    firstName:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(35)
    lastName:string;
   
   
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,{message: 'password must contain at least one Uppercase, One number and One special key'})
    password:string;


    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    DOB:string
   }
   