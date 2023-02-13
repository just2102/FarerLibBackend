const User = require("../models/userModel")
const Role = require("../models/roleModel")
const bcrypt = require('bcryptjs');
const {validationResult} = require("express-validator")
const jwt = require('jsonwebtoken');
const session = require("express-session");

const generateAccessToken = (id,roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: "24h"})
}

class authController {
    async whoAmI(req,res) {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            res.status(401).json({message: "No authorization header found"})
        }
        const [, token] = authorizationHeader.split(" ");
        try {
            // verify the token
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
            // get user from db
            const user = await User.findById(decoded.id)
            // return the user without the password field
            const userToReturn = {
                id: user._id,
                username: user.username,
                role: user.roles[0]
            }
            return res.json(userToReturn)
        } catch(err) {
            return res.status(401).json({message:"Invalid token"})
        }
    }

    async register(req,res) {
        try {
            const errors = validationResult(req)
            if (errors.length) {
                console.log(errors.length)
                return res.status(400).json({message: "Registration error", errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Username taken! Please choose a different username"})
            }
            const hashedPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})

            const user = new User({username, password: hashedPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: "Registration successful"})

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Registration error"})
        }

    }
    async login(req,res) {
        // returns token on success
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Incorrect username or password'})
            }
            const token = generateAccessToken(user._id, user.roles)
            req.session.token = token;
            return res.json({token})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Login error"})
        }
    }
    async logout(req,res) {
        await req.session.destroy();
        res.status(200).json({message:"You have successfully logged out"});
    }

    async getUsers(req,res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch(e) {
            
        }
    }
}

module.exports = new authController()