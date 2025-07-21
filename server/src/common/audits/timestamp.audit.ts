import { Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export abstract class TimestampAuditEntity {
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  setCreateDate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = new Date();
  }
}
