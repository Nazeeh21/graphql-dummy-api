import 'reflect-metadata';
import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import express from 'express';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { MyContext } from './types';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from './entities/Post';
import path from 'path';

const main = async () => {
  // @ts-ignore
  const conn = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Post],
  });

  // await conn.runMigrations()

  const app = express();

  app.set('trust proxy', 1);
  app.use(
    cors({
      // origin: process.env.CORS_ORIGIN,
      origin: '*',
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    playground: true,
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(+process.env.PORT || 4000, () => {
    console.log('server started on port ', +process.env.PORT);
  });

  // const post = orm.em.create(Post, { title: 'my first post' });
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {})
  // console.log(posts)
};

main().catch((e) => {
  console.log(e);
});
