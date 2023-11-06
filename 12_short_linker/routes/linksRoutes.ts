import { LinksController } from '../controllers/linksController';
import { Router } from 'express';

export class LinksRoutes {
    router: Router;
    path: string;
    linksController: LinksController;

    constructor(path: string) {
        (this.router = Router()), (this.path = path), (this.linksController = new LinksController());
        this.router.post('/short', this.linksController.addShortUrl);
        this.router.get('/:link', this.linksController.getLink);
    }
}