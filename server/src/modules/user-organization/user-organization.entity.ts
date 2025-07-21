import { TimestampAuditEntity } from 'src/common/audits/timestamp.audit';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { OrganizationPermissions } from './enums/organization-permissions.enum';

@Entity('_user_organization')
export class UserOrganization extends TimestampAuditEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: ObjectId;

  @Column()
  organizationId: ObjectId;

  @Column('simple-array')
  permissions: OrganizationPermissions[];
}
