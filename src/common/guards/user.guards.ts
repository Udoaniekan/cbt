import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract token from the Authorization header
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token is missing'); // More specific error message
    }

    try {
      // Verify token and decode the payload
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET, // Use the correct JWT secret
      });

      // Assign the decoded payload to the request object for use in route handlers
      request['user'] = payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired'); // Handle expired token specifically
      }
      throw new UnauthorizedException('Invalid token'); // Generic invalid token error
    }

    return true;
  }

  // Helper method to extract the token from the Authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined; // Return the token only if it's a Bearer token
  }
}
