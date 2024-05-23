const routers = require('express').Router()
const Controller = require('../controllers/controller')
// const userController = require('../controllers/userController')

//bisa semua pengguna
routers.get('/', Controller.landingPage)
routers.get('/home', Controller.homePage)


routers.get('/register', Controller.registerForm)
routers.post('/register', Controller.handleRegister)
routers.get('/login', Controller.loginForm)
routers.post('/login', Controller.handleLogin)
routers.get('/logout', Controller.logout)

const user = (function (req, res, next){
  // console.log(req.session)
  if(!req.session.user){
    const err = 'please login'
    res.redirect(`/login?error=${err}`)
  } else {
    next()
  }
})

const admin = (function (req, res, next){
  console.log(req.session)
  if(req.session.isAdmin === false){
    res.redirect('/user/home')
  } else {
    next()
  }
})

//admin only
routers.get('/admin/user', admin,  Controller.adminDashboardUser)
routers.get('/admin/post', admin, Controller.adminDashboardPost)

// user only
routers.get('/user/:userId/profile', user,Controller.userProfile)
routers.get('/user/:userId/profile/setup', user, Controller.profileSetup)
routers.post('/user/:userId/profile/setup', Controller.handleSetup)
// routers.get('/post/:postId/detail')
// routers.get('/post/:postId/edit')
// routers.post('/post/:postId/edit')
// routers.get('/post/:postId/like')

module.exports = routers