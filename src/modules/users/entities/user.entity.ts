
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';
import { Role } from './roles.entity';



@Entity('users') // Usar {} para dar un nombre de la tabla diferente, si no esta tomara el nombre de la clase
export class User {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({type:'varchar', length: 50})
  name: string;

  @Column()
  password: string; // hashed

  // --------------------------------
  // NUEVO: relación con Role
  // --------------------------------
  @ManyToOne(() => Role, role => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => RefreshToken, rt => rt.user, { cascade: true })
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
