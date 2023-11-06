import { MongoClient, ServerApiVersion } from "mongodb";
import { dataRecord } from "../schemas/urlSchema";

export class RoutesRepository {
    client: MongoClient;
    constructor(CONN_URL: string) {
        this.client = new MongoClient(CONN_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }

    private init = async () => {
        await this.client.connect();
        return this.client.db("shortlinks").collection("short");
    };

    public findByLink = async (link: string) => {
        const data = await this.init();
        const linkRecord = await data.findOne<dataRecord>({ link: link });
        if (linkRecord) return linkRecord
        return undefined
    };

    public loadShorted = async (link: string, shortedLink: string) => {
        const data = await this.init()
        await data.insertOne({
            link: link,
            shorted_link: shortedLink,
        });
    };

    public getLink = async (shortedLink: string) => {
        const data = await this.init();
        const linkRecord = await data.findOne<dataRecord>({ shorted_link: shortedLink });
        return linkRecord
    };
}