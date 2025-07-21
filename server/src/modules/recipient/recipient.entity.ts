import { TimestampAuditEntity } from 'src/common/audits/timestamp.audit';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Recipient extends TimestampAuditEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  organizationId?: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
