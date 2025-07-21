import { TimestampAuditEntity } from 'src/common/audits/timestamp.audit';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('_organizations')
export class Organization extends TimestampAuditEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: 'My Organization' })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  cover_image?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  contact_email?: string;

  @Column({ nullable: true })
  contact_phone?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  address?: string;
}
