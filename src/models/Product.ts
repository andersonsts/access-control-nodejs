import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity("products")
class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @Expose({ name: 'image_url' })
  getImageUrl(): string | null {
    if(!this.image) {
      return null;
    }

    return `http://localhost:3333/files/${this.image}`;
  }
}

export default Permission;
