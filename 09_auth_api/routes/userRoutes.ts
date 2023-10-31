import { UsersController } from "../controllers/userController";
import { Router } from "express";
import { verifyTokenMiddleware } from '../middleware/jsonVerify';

export class UsersRoutes {
    router: Router;
    path: string;
    usersController: UsersController;

    constructor(path: string) {
        (this.router = Router()),(this.path = path),(this.usersController = new UsersController());
        this.router.post('/me', verifyTokenMiddleware ,this.usersController.getUser);
    }
}
