// update-role.dto.ts
import { IsEnum } from 'class-validator';
import { UserRole } from '../enum/enum.user';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
