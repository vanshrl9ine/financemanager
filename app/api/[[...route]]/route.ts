import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import  {z} from 'zod';
import {zValidator} from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
export const runtime = 'edge'
import accounts from './accounts';
import categories from './categories'
import { HTTPException } from 'hono/http-exception';
import  transactions  from './transactions'
import summary from './summary'
const app = new Hono().basePath('/api')

const routes=app
.route("/accounts",accounts)
.route("/categories",categories)
.route("/transactions",transactions)
.route("/summary",summary)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)


export type AppType=typeof routes;
//end to end type safety
