const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const  User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')


module.exports.login = async (req, res) => {

    const candidate = await User.findOne({
       email: req.body.email
    })

    if (candidate) {
    //    user exist
        const passwordResult = bcrypt.compareSync(
            req.body.password,
            candidate.password
        )
        if (passwordResult) {
        //    pass is correct. generation of token
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {
                expiresIn: 60*60
            })

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else  {
        //    user not found. error
            res.status(404).json({
                message: 'password not correct.'
            })
        }
    } else {
    //    error
        res.status(404).json({
            massage: 'user not founded.'
        })
    }
}

module.exports.register = async (req, res) => {
    //email password

    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
    //    user exist, should send 'error'
       res.status(409).json({
           message: 'Email is exist, try another.'
       })

    } else {
        //  should create user
        const salt = bcrypt.genSaltSync(10) //encrypting password
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
        //    error handler
           errorHandler(res, e)
        }
    }


}
