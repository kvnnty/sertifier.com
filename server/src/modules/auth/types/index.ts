import { User, UserDocument } from "@/modules/users/schemas/user.schema";

export interface AuthResult {
  user: any;
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
}
