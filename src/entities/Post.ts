import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Comment } from './Comment';
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  
  @Field()
  @PrimaryGeneratedColumn()
  id!: number; // string is also supported

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  // field for comments
  // @Field(() => [Comment], { nullable: true })
  // @OneToMany(() => Comment, (comment) => comment.post)
  // comments: Comment[];

}
