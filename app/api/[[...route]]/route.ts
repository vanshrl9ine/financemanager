import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import  {z} from 'zod';
import {zValidator} from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/',clerkMiddleware() ,
  (c) => {
  const auth=getAuth(c);
  if(!auth?.userId) return c.redirect('http://localhost:3000/sign-in');

  return c.json({
    message: 'Hello Next.js!',
    userId:auth.userId
  })
})


export const GET = handle(app)
export const POST = handle(app)
