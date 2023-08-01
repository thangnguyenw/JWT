import User from '../models/userModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

let refreshTokens = [];
class AuthController {
    // renerate access token
    generateAccessToken = (user) => {
        return jwt.sign({
            id: user.id, // = user._id
            admin: user.admin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "10s" },
        );
    }
    // generate refresh token
    generateRefreshToken = (user) => {
        return jwt.sign({
            id: user.id, // = user._id
            admin: user.admin
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "30d" },
        );
    }

    // register
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
            const user = await newUser.save(user);
            res.status(200).json({
                user
            })
        } catch (err) {
            res.status(500).json({
                err
            })
        }
    }

    // login
    login = async (req, res, next) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) res.status(404).json("Wrong username")

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )

            if (user && validPassword) {
                const accessToken = this.generateAccessToken(user);
                const refreshToken = this.generateRefreshToken(user);
                refreshTokens.push(refreshToken)
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                const { password, ...others } = user._doc;
                res.status(200).json({
                    ...others, accessToken
                })
            }
        } catch (err) {
            res.status(500).json({
                err
            })
        }
    }

    // requestRefreshToken
    requestRefreshToken = (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) return res.status(401).json("You 're not authenticated");

        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Token is not valid");
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            try {
                const newAccessToken = this.generateAccessToken(user);
                const newRefreshToken = this.generateRefreshToken(user);
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                });

                refreshTokens.push(newRefreshToken);
                res.status(200).json({ accessToken: newAccessToken });
            } catch(err) {
                console.log(err);
            }
        });
    }
}

// const authController = new AuthController(user);
export default new AuthController();

// store token
// 1 local storage => XSS
// 2 http only cookies => CSRF -> khắc phục bằng samesite
// 3 redux store lưu access token và httponly cookies lưu refresh token