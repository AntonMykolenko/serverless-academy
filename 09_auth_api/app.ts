import express from 'express';
import { AuthRoutes } from './routes/authRoutes';
import { UsersRoutes } from './routes/userRoutes';


const app = express();

app.use(express.json());

const authRoutes = new AuthRoutes('/auth');
const userRoutes = new UsersRoutes('/');

const routers = [authRoutes, userRoutes];

routers.forEach(router => {
    app.use(router.path, router.router);
});

export default app;