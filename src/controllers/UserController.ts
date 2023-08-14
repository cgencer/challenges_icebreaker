import bcrypt from "bcrypt";
import { Users } from '../models/Users.js';

interface Base {
    get_user: (req: any, res: any) => void;
    update_user: (req: any, res: any) => void;
    delete_user: (req: any, res: any) => void;
}

/* get single user */
export class UserController implements Base {

    async get_user(req: any, res: any): Promise<void> {

        try {
            const user = await Users.findByPk(req.params.id);
            if (!user) {
                res.status(404).json({
                    type: "error",
                    message: "User doesn't exists"
                })
            } else {
                const { password, ...data } = user;
                res.status(200).json({
                    type: "success",
                    data
                })
            }
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    };

    /* update user */
    async update_user (req: any, res: any): Promise<void> {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        try {
            const updatedUser = await Users.update({
                ...req.body
            },{
                where: { id: req.params.id }
            });

/*
            const updatedUser = await Users.findByIdAndUpdate(req.params.id, { $set: req.body },{ new: true });
*/
            res.status(200).json({
                type: "success",
                message: "User updated successfully",
                updatedUser
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    };

    /* delete user */
    async delete_user (req: any, res: any): Promise<void> {
        try {
              await Users.destroy({ where: { id: req.params.id } })
//            await Users.findByIdAndDelete(req.params.id)

            res.status(200).json({
                type: "success",
                message: "User has been deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        } 
    };
};