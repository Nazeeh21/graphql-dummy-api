import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type MyContext = {
  // @ts-ignore-start
  req: Request & { session: Express.Session };
  res: Response;
  // @ts-ignore-end
};
