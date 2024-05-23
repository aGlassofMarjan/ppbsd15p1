const routers = require('express').Router()
const Controller = require('../controllers/controller')
const { isLoggedIn, isNotLoggedIn, isAdmin } = require('../middlewares/auth')
// const userController = require('../controllers/userController')

//bisa semua pengguna
routers.get('/', Controller.landingPage)
routers.get('/home', Controller.homePage)


routers.get('/register', isNotLoggedIn,  Controller.registerForm)
routers.post('/register',isNotLoggedIn, Controller.handleRegister)
routers.get('/login',isNotLoggedIn,Controller.loginForm)
routers.post('/login',isNotLoggedIn, Controller.handleLogin)

// const user = (function (req, res, next){
//   // console.log(req.session)
//   if(!req.session.user){
//     const err = 'please login'
//     res.redirect(`/login?error=${err}`)
//   } else {
//     next()
//   }
// })

// const admin = (function (req, res, next){
//   console.log(req.session)
//   if(req.session.isAdmin === false){
//     res.redirect('/user/home')
//   } else {
//     next()
//   }
// })

//admin only
routers.get('/admin/user', isAdmin,  Controller.adminDashboardUser)
routers.get('/admin/post', isAdmin, Controller.adminDashboardPost)
routers.get('/admin/suspend/:userId', isAdmin, Controller.suspend)

routers.use(isLoggedIn)
// user only
routers.get('/suspended', Controller.handleSuspend)
routers.get('/user/:userId/profile', Controller.userProfile)
routers.get('/user/:userId/profile/setup', Controller.profileSetup)
routers.post('/user/:userId/profile/setup', Controller.handleSetup)
routers.get('/post/:profileId', Controller.postContent)
routers.post('/post/:profileId', Controller.handlePost)
routers.get('/post/:postId/detail', Controller.postDetail)
// routers.get('/post/:postId/edit')
// routers.post('/post/:postId/edit')
routers.get('/like/:PostId', Controller.handleLike)
routers.get('/logout', Controller.logout)


module.exports = routers