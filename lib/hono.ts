import { hc } from "hono/client"
import { AppType } from "../app/api/[[...route]]/route"
// import { config } from 'dotenv';

// config({ path: '.env.local' });
export const client=hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
