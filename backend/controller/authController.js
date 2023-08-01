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
            res.stutus(200).json({
                newUser
            })
        } catch (error) {
            res.status(500).json({
                err
            })
        }
    }
}

const authController = new AuthController();
export default authController;