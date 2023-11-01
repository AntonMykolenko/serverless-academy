import express from "express";
import convertIPToLocation from "./utils/findIp";
import { Request, Response } from "express";

const app = express();

app.set("trust proxy", true);

app.use('/ip', async (req: Request, res: Response) => {
    try {
        console.log(req.ip);
        if (req.ip !== undefined) {
            const resp = await convertIPToLocation(req.ip);
            res.setHeader("Content-Type", "application/json");
            res.send(resp);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default app;