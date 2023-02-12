const express = require("express")
const router = express.Router()
const controller = require("../controllers/authController")
const {check} = require("express-validator")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.post('/register', [
    check('username', "Username cannot be empty").notEmpty(),
    check('password', "Password should be longer than 4 and shorter than 15 symbols").isLength({min:4, max:15})
], controller.register)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)



module.exports = router