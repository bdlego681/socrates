import 'dotenv/config';
import { z } from 'zod';

const parsed = z.object({
  PORT: z.coerce.number().default(3000), NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1).optional(), DB_DRIVER: z.enum(['tedious', 'msnodesqlv8']).default('tedious'),
  DB_SERVER: z.string().min(1).optional(), DB_DATABASE: z.string().min(1).optional(), DB_ODBC_DRIVER: z.string().min(1).default('ODBC Driver 18 for SQL Server'), SESSION_COOKIE_NAME: z.string().default('portal_session'),
  SESSION_TTL_HOURS: z.coerce.number().positive().default(24), SESSION_TOKEN_PEPPER: z.string().min(24),
  MFA_ENCRYPTION_KEY: z.string().regex(/^[A-Za-z0-9_-]{43}$/, 'must be a base64url-encoded 32-byte key'), MFA_PENDING_TTL_MINUTES: z.coerce.number().positive().max(15).default(5),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false').transform(v => v === 'true'),
  CORS_ORIGIN: z.string().url().default('http://localhost:4200')
}).superRefine((value, ctx) => {
  if (value.DB_DRIVER === 'tedious' && !value.DATABASE_URL) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'DATABASE_URL is required for the tedious driver' });
  if (value.DB_DRIVER === 'msnodesqlv8' && (!value.DB_SERVER || !value.DB_DATABASE)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'DB_SERVER and DB_DATABASE are required for Windows Integrated Security' });
}).safeParse(process.env);
if (!parsed.success) { console.error(parsed.error.flatten().fieldErrors); throw new Error('Invalid environment configuration'); }
export const env = parsed.data;
