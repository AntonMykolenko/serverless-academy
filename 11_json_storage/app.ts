import express from 'express';
import { JsonRoutes } from './routes/jsonRoutes';


const app = express();
app.use(express.json());

const jsonRoutes = new JsonRoutes('/');

const routers = [jsonRoutes];

routers.forEach(router => {
    app.use(router.path, router.router);
});

export default app;

