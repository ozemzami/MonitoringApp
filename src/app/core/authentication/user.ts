import { Role } from './role.enum';

export class User {
  id: string;
  email: string;
  token?: string;
  role: Role;
}
