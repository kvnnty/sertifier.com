import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('_users')
export class User {
  @ObjectIdColumn()
  id: string;

  @Column({ unique: true })
  @IsNotEmpty()
  firstName: string;

  @Column({ unique: true })
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
