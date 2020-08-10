import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Role from './Role';

@Entity("users")
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'roles_users',
    joinColumns: [{ name: 'user_id'}],
    inverseJoinColumns: [{ name: 'role_id'}]
  })
  roles: Role[]

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if(!this.avatar) {
      return null;
    }

    return `http://localhost:3333/files/${this.avatar}`;
  }
}

export default User;
