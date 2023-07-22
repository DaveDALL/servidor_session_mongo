const express = require('express')
const {Router} = express
const User = require('../dao/models/user.model')
const authRouter = new Router()

adminUser = {
    userName: 'administrator',
    userMail: 'adminCoder@coder.com',
    userPassword: 'adminCod3r123',
    userRoll: 'admin'
}

authRouter.post('/authRegistration', async (req, res) => {
    let {userName, lastName, userMail, userPassword} = req.body
    try {
        if(userName && lastName && userMail && userPassword) {
            let foundUser = await User.findOne({userMail: userMail})
            if(!foundUser) {
                let createdUser = await User.create({
                    userName,
                    lastName,
                    userMail,
                    userPassword,
                    userRoll: 'usuario'
                })
                res.redirect(200, '/')
            }else res.status(400).send('El usuario ya existe!!')
        }
    }catch(err) {
        console.log('No se pudo crear el usuario con mongoose ' + err)
    }
})

authRouter.post('/authLogin', async (req, res) => {
    let {userMail, userPassword} = req.body
    let foundUser = {}
    try {
        if(userMail === adminUser.userMail && userPassword === adminUser.userPassword) {
            foundUser = adminUser
        }else {
            foundUser = await User.findOne({$and: [{userMail: userMail}, {userPassword: userPassword}]})
        }
        if(foundUser) {
            req.session.userMail = foundUser.userMail
            req.session.userPassword = foundUser.userPassword
            req.session.userName = foundUser.userName
            req.session.lastName = foundUser.lastName || ' '
            req.session.userRoll = foundUser.userRoll
            res.redirect('/products')
        }else res.status(401).send('Usuario no autorizado, verifque sus datos')
    }catch(err) {
        console.log('No se pudo confirmar el usuario con mongoose ' + err)
    }
})

module.exports = authRouter
