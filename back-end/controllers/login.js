const User = require('../models/User');
const bcrypt=require('bcrypt');
const cookieParser = require('cookie-parser');
// app.use(cookieParser());
const{createToken, validateToken}=require('../middleware/JWT');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    // Check if user exists before trying to access its properties
    if (!user) {
        return res.status(400).json({ error: "User doesn't exist!" });
    }

    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) {
            return res.status(400).json({ error: "Wrong email or password!" });
        } else {
            const accessToken = createToken(user);
            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 30 * 1000,
                httpOnly: true,
            });
            // Modified, added userId to send the logged-in user's ID
            return res.json({ message: "Logged in!", userId: user.id });
        }
    });
};
    

module.exports={loginUser};