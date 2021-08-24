import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type MyContext = {
  // @ts-ignore-start
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis,
  // @ts-ignore-end
};
