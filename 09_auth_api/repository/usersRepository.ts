import { Pool } from 'pg';
import dotenv from 'dotenv';
import { User } from '../schemas/userSchema';

dotenv.config();

export class UsersRepository {
    private pool: Pool;
    constructor() {
        this.pool = new Pool({ connectionString: process.env.DATABASE_LINK || "postgresql://postgres:123qwe456@localhost:5432/postgres" })
    }

    public async createUser(user: User) {
        try {
            const query = `
                INSERT INTO authAPI (id, email, password)
                VALUES ($1, $2, $3);
            `;
            const values = [user.id, user.email, user.password];
            const result = await this.pool.query(query, values);
        } catch (err: any) {
            throw new Error(`Error creating user: ${err.message}`);
        }
    }

    public async getUserByEmail(email: string) {
        try {
            const query = `
                SELECT * FROM authAPI WHERE email = $1;
            `;
            const values = [email];
            const result = await this.pool.query(query, values);
            return result;
        } catch (err: any) {
            throw new Error(`Error getting user: ${err.message}`);
        }
    }

    public async getUserId(email: string) {
        try {
            const query = `
                SELECT id FROM authAPI WHERE email = $1;
            `;
            const values = [email];
            const result = await this.pool.query(query, values);
            return result.rows[0].id;
        } catch (err: any) {
            throw new Error(`Error getting user: ${err.message}`);
        }
    }

    public async checkUser(email: string) {
        try {
            const result = await this.getUserByEmail(email);
            if (result.rowCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err: any) {
            throw new Error(`Error checking user: ${err.message}`);
        }
    }
}