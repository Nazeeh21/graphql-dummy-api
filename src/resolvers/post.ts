import {
  Arg,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  // ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

// @ObjectType()
// class PaginatedPosts {
//   @Field(() => [Post])
//   posts: Post[];
// }

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Query(() => [Post])
  async posts(@Arg('limit', () => Int) limit: number): Promise<Post[]> {
    const realLimit = Math.min(50, limit);

    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    const posts = await getConnection().query(
      `
      select p.*
      from post p
      order by p."createdAt" DESC
      limit $1
    `,
      replacements
    );

    return posts.slice(0, realLimit);
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(@Arg('input') input: PostInput): Promise<Post> {
    // 2 sql queries
    return Post.create({ ...input }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string,
    @Arg('text', { nullable: true }) text: string
  ): Promise<Post | null> {
    // return Post.update({id, creatorId: req.session.userId}, {title, text});

    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id', {
        id: id,
      })
      .returning('*')
      .execute();

    // console.log('result: ', result);

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
    // not cascade way
    // const post = await Post.findOne(id);

    // if (!post) {
    //   return false;
    // }

    // if (post.creatorId !== req.session.userId) {
    //   throw new Error('not authorized');
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    await Post.delete({ id });
    return true;
  }
}
