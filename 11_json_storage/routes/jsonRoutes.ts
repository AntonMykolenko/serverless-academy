import { JsonController } from "../controllers/jsonController";
import { Router } from "express";

export class JsonRoutes {
    router: Router;
    path: string;
    jsonController: JsonController;

    constructor(path: string) {
        (this.router = Router()), (this.path = path), (this.jsonController = new JsonController());
        this.router.put('/:path', this.jsonController.addJson);
        this.router.get('/:path', this.jsonController.getJson);
    }
}