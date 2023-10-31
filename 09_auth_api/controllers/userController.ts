import { UsersRepository } from "../repository/usersRepository";
import { Request, Response } from 'express';

export class UsersController {
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    }

    public getUser = async (req: Request, res: Response) => {
        try {
            const verifiedToken = req.user;
            const email = verifiedToken as string;
            if (email) {
                const userData = await this.usersRepository.getUserByEmail(email);
                if (userData.rowCount > 0) {
                    const returningData = {
                        success: true,
                        data: {
                            id: userData.rows[0].id,
                            email: userData.rows[0].email,
                        },
                    };
                    res.status(200).send(returningData);
                } else {
                    throw new Error("User not found");
                }
            } else {
                throw new Error("Email not found in token");
            }
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    }
}