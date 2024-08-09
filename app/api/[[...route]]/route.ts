import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import  {z} from 'zod';
import {zValidator} from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
export const runtime = 'edge'
import accounts from './accounts';
import { HTTPException } from 'hono/http-exception';
const app = new Hono().basePath('/api')

const routes=app
.route("/accounts",accounts);

export const GET = handle(app)
export const POST = handle(app)

export type AppType=typeof routes;
//end to end type safety
