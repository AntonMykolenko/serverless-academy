import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { jsonbase, JsonBaseData } from '../schemas/jsonBaseSchemas';
import dotenv from 'dotenv';

dotenv.config();

export class JsonRepository {
    private db: NodePgDatabase;
    constructor() {
        const pool = new Pool({
            connectionString: `${process.env.DB_LINK}`
        });
        this.db = drizzle(pool);
    }

    public async addJson(name: string, json: string) {
        try{
            await this.db.insert(jsonbase).values({name, json}).execute();
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public async getJson(name: string) {
        try{
            const json = await this.db.select().from(jsonbase).where(eq(jsonbase.name, name)).execute();
            return json[0];
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public async findData(name: string) {
        try{
            const data = await this.db.select().from(jsonbase).where(eq(jsonbase.name, name)).execute();
            return data[0];
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}