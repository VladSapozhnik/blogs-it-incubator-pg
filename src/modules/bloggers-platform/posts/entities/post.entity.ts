import { CreatePostDto } from '../dto/create-post.dto';
import { CreatePostForBlogDto } from '../dto/create-post-for-blog.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from '../../blogs/entities/blog.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  title: string;
  @Column({ type: 'varchar' })
  shortDescription: string;
  @Column({ type: 'varchar' })
  content: string;
  @ManyToOne(() => Blog, (blog) => blog.Posts)
  blog: Blog;
  @Column({ type: 'uuid' })
  blogId: string;
  // blogName: string;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  static createInstance(dto: CreatePostDto): Post {
    const post = new this();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

    return post;
  }

  static createInstancePostForBlog(dto: CreatePostForBlogDto, blogId: string) {
    const post = new this();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = blogId;

    return post;
  }

  updatePost(dto: UpdatePostDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
  }
}
