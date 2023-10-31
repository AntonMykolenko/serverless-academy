import express from 'express';
import { config } from 'dotenv';
import { AuthRoutes } from './routes/authRoutes';
import { UsersRoutes } from './routes/userRoutes';

config();

const app = express();

app.use(express.json());

const authRoutes = new AuthRoutes('/auth');
const userRoutes = new UsersRoutes('/');

const routers = [authRoutes, userRoutes];

routers.forEach(router => {
    app.use(router.path, router.router);
});

export default app;