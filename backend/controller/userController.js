import User from '../models/userModel.js';
import bcrypt from 'bcrypt'

class UserController {
    // get all users
    getAllUsers = async (req, res, next) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({
                err
            })
        }
    }

    // delete user 
    deleteUser = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        } catch {
            res.status(500).json({
                err
            })
        }
    }
}

// const userController = new UserController();
export default new UserController();