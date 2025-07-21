import * as bcrypt from 'bcrypt';
import { TimestampAuditEntity } from 'src/common/audits/timestamp.audit';
import {
  Column,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

@Entity('_users')
export class User extends TimestampAuditEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
