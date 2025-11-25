import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({type:'varchar', length:3})
  code:string;

  @Column({ unique: true })
  name: string; // ej: 'admin', 'user', 'manager'

  @OneToMany(() => User, user => user.role)
  users: User[];
}
