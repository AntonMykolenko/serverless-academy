import { ShortLinkUtils } from "../utils/shortLink";
import { Request, Response } from "express";
import { RoutesRepository } from "../repository/linksRepository";
import { validURL } from "../utils/validUrl";

const CONN_URL = `mongodb://localhost:27017`;
const BASE_URL = `localhost:3000/`;

export class LinksController {
    public async addShortUrl(req: Request<{ link: string }>, res: Response) {
        const {
            body: { link },
        } = req;
        try {
            const repository = new RoutesRepository(CONN_URL)
            const urlCheck = validURL(link);
            if(urlCheck === true) {
            const foundByLink = await repository.findByLink(link)
            if (foundByLink) {
                const shortedLink = foundByLink.shorted_link
                return res.status(200).send(shortedLink)
            }
            const shortedLink = new ShortLinkUtils().shortLink()
            await repository.loadShorted(link, shortedLink)
            return res.status(200).send(shortedLink)
        } else {
            return res.status(400).send("invalid url")
        }
        } catch (err) {
            console.log(err)
            return res.status(500).send("server error")
        }
    }
    public async getLink(req: Request<{ link: string }>, res: Response) {
        const {
            params: { link: route },
        } = req;

        try {
            const repository = new RoutesRepository(CONN_URL)
            const shortedLink = `${BASE_URL}${route}`
            const responseData = await repository.getLink(shortedLink)
            if (responseData) {
                return res.status(200).send(responseData.link)
            }
            return res.status(404).send("link wasn`t found")
        } catch (err) {
            console.log(err)
            return res.status(500).send("server error")
        }
    }
}