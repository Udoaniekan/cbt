import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { sub: string; email: string }): Promise<{ userId: string; email: string }> {
        const { email, sub } = payload;
        const user = await this.userService.findByEmail(email); // Updated to use findByEmail

        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint');
        }

        return { userId: sub, email };
    }
}
