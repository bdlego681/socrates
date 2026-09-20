import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import usersRoutes from './routes/users.routes.js';

export const app = express();
app.set('trust proxy', 1); app.use(helmet()); app.use(cors({ origin: env.CORS_ORIGIN, credentials: true })); app.use(express.json({ limit: '10kb' })); app.use(cookieParser());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' })); 
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
