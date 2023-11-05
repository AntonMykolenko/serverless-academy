import { UsersRepository } from "../repository/usersRepository";
import { User } from "../schemas/userSchema";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 10;

export class AuthController {
    static usersRepository: UsersRepository;
    constructor() {
        AuthController.usersRepository = new UsersRepository();
    }

    public async signUp(req: Request, res: Response) {
        try {
            const user: { email: string; password: string } = req.body;
            const emailCheck = await AuthController.usersRepository.checkUser(user.email);
            console.log(emailCheck);
            if (emailCheck === false) {
                const hashedPassword: string = bcrypt.hashSync(user.password, saltRounds).toString();
                const userUuid: string = uuidv4().toString();
                const userEncrypted: User = {
                    id: userUuid,
                    email: user.email,
                    password: hashedPassword
                };

                await AuthController.usersRepository.createUser(userEncrypted);
                let accessToken: string, refreshToken: string;
                if (process.env.JWT_SECRET) {
                    const expirationTime = process.env.TOKEN_TTL;
                    if (expirationTime) {
                        accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                            expiresIn: expirationTime,
                        });
                        refreshToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                    } else {
                        throw new Error("JWT_EXPIRATION_TIME is not defined");
                    }
                } else {
                    throw new Error("JWT_SECRET is not defined");
                }
                const returningData = {
                    success: true,
                    data: {
                        id: await AuthController.usersRepository.getUserId(user.email),
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    }
                }
                res.status(201).send(returningData);
            } else {
                const errorData = {
                    success: false,
                    error: "User already exists"
                }
                res.status(409).send(errorData);
            }
        } catch (err: any) {
            console.log(err);
            res.status(500).send("internal server error");
        }
    }

    public async signIn(req: Request, res: Response) {
        try {
            const user: { email: string; password: string } = req.body;
            const emailCheck = await AuthController.usersRepository.checkUser(user.email);
            console.log(emailCheck);
            if (emailCheck === true) {
                let accessToken: string, refreshToken: string;
                if (process.env.JWT_SECRET) {
                    const expirationTime = process.env.TOKEN_TTL;
                    if (expirationTime) {
                        accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                            expiresIn: expirationTime,
                        });
                        refreshToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                    } else {
                        throw new Error("JWT_EXPIRATION_TIME is not defined");
                    }
                } else {
                    throw new Error("JWT_SECRET is not defined");
                }
                const returningData = {
                    success: true,
                    data: {
                        id: await AuthController.usersRepository.getUserId(user.email),
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    }
                }
                res.status(201).send(returningData);
            } else {
                const errorData = {
                    success: false,
                    error: "Not found"
                }
                res.status(404).send(errorData);
            }
        } catch (err: any) {
            console.log(err);
            res.status(500).send("internal server error");
        }
    }
}