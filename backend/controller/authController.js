import User from '../models/userModel.js';
import bcrypt from 'bcrypt'

class AuthController {
    register = async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            })
            const user = await newUser.save();
            res.status(200).json({
                user
            })
        } catch (err) {
            res.status(500).json({
                err
            })
        }
    }
}

const authController = new AuthController();
export default authController;