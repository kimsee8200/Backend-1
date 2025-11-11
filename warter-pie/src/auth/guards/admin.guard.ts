import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserType } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    console.log(user);
    // Check for ADMIN user type
    if (user && user.userType === UserType.ADMIN) {
      return true;
    }

    throw new ForbiddenException('You do not have administrative privileges.');
  }
}
