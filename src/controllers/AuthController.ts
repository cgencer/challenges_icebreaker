import { validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import { encode_reg_token } from '../helpers/tokens.js';
import _ from 'lodash';
import { Users } from '../models/Users.js';

interface Base {
    createUser: (req: any, res: any) => void;
    loginUser: (req: any, res: any) => void;
}

/* create new user */
export class AuthController implements Base {

    // public static async build(): Promise<MyClass> {

    public async createUser(req: any, res: any): Promise<void> {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({
                type: 'error',
                message: errors.array()
            });
        } else {
            try {
                const { username, email, password } = req.body; 
                const newUser = new Users({
                    userName: username,
                    email: email,
                    password: password
                });

                const user = await newUser.save();
                res.status(201).json({
                    type: 'success',
                    message: "User has been created successfuly",
                    data: user
                });

            } catch (err) {
                res.status(500).json({
                    type: 'error',
                    message: err
                });
            }    
        }
    };

    /* user login */
    public async loginUser(req: any, res: any): Promise<void> {
        try {
            const { username } = req.body;

            /* check user is exist with our system */
            const user = await Users.findOne({ where: { userName: username } });
            if (!user) {
                return res.status(401).json({
                    type: 'error',
                    message: 'No account is associated with the given username'
                });
            }

            /* compare password */
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    type: 'error',
                    message: 'Invalid credentials'
                });
            }

            /* create access token */
            const accessToken = encode_reg_token(user.id);

            /* avoid send password in response */
            const { password, ...data } = user;
            res.status(200).json({
                type: 'sucesss',
                data,
                accessToken
            });
        } catch (err) {
            res.status(500).json({
                type: 'error',
                message: err
            });
        }
    };
};
