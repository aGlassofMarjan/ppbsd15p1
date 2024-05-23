const routers = require('express').Router()
const Controller = require('../controllers/controller')
const userController = require('../controllers/userController')

routers.get('/', Controller.landingPage)
routers.get('/register', userController.registerForm)
routers.post('/register', userController.handleRegister)
routers.get('/login', userController.loginForm)
routers.post('/login', userController.handleLogin)
routers.get('/logout', userController.logout)

routers.use(function (req, res, next){
  console.log(req.session)
  if(!req.session.user){
    const err = 'please login'
    res.redirect(`/login?error=${err}`)
  } else {
    next()
  }
})

const admin = (function (req, res, next){
  console.log(req.session)
  if(req.session.isAdimin === false){
    res.redirect('/user/home')
  } else {
    next()
  }
})

routers.get('/admin/user', admin,  Controller.adminDashboardUser)
routers.get('/admin/post', admin, Controller.adminDashboardPost)
routers.get('/user/home', Controller.homePage)

module.exports = routers