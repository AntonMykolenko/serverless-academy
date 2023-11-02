import { Request, Response } from "express";
import { JsonRepository } from "../repository/jsonRepository";

const jsonRepository = new JsonRepository();

export class JsonController {
    public async addJson(req: Request<{ path: string }>,
        res: Response<string | { [key: string]: any }>) {
        const { path } = req.params;
        try {
            const jsonData = req.body;
            const data = await jsonRepository.findData(path);
            if (!data ) {
                await jsonRepository.addJson(path, jsonData);
                return res.status(200).send('Json added');
            } else if (data) {
                return res.status(400).send('Json already exists');
            }
        } catch (err: any) {
            return res.status(500).send(err.message);
        }
    }

    public async getJson(req: Request<{ path: string }>,
        res: Response<string | { [key: string]: any }>) {
        const { path } = req.params;
        try {
            const data = await jsonRepository.getJson(path);
            const jsonObject = JSON.parse(data.json);
            const returnedObject = {
                name: data.name,
                json: jsonObject
            }
            if (data) {
                return res.status(200).send(returnedObject);
            } else {
                return res.status(400).send('Json does not exist');
            }
        } catch (err: any) {
            return res.status(500).send(err.message);
        }
    }
}