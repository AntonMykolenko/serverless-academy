import { AuthController } from "../controllers/authController";
import { Router } from "express";

export class AuthRoutes {
    router: Router;
    path: string;
    authController: AuthController;

    constructor(path: string) {
        (this.router = Router()),(this.path = path),(this.authController = new AuthController());
        this.router.post('/sign-up', this.authController.signUp);
        this.router.post('/sign-in', this.authController.signIn);
    }
}
