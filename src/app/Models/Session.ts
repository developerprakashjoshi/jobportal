import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('session')
export class Session {
  @PrimaryColumn('varchar', { length: 255, collation: 'default' })
  sid: string;

  @Column('json', { nullable: false })
  sess: any;

  @Column('timestamp', { nullable: false, precision: 6 })
  expire: Date;
}