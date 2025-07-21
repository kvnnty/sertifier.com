import { TimestampAuditEntity } from 'src/common/audits/timestamp.audit';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Certificate extends TimestampAuditEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  templateId: ObjectId;

  @Column()
  recipientId: ObjectId;

  @Column()
  organizationId: ObjectId;

  @Column()
  issueDate: Date;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column()
  status: string;

  @Column()
  uniqueCode: string;

  @Column({ type: 'json' })
  data: Record<string, string>;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
