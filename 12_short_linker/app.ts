import express from 'express';
import { LinksRoutes } from './routes/linksRoutes';

const app = express();

app.use(express.json());

const linksRoutes = new LinksRoutes('/');

const routers = [linksRoutes];

routers.forEach(router => {
    app.use(router.path, router.router);
});

export default app;
