const {User, Profile, Category, Post, Interaction} = require('../models')
const reversedDate = require('../helpers/formatDate')
const bcrypt = require('bcryptjs')

class Controller {

static async landingPage(req, res){
  try { 
    res.render('landingpage')
  
  } catch (error) {
    res.send(error)
  }
}

static registerForm(req, res) {
  res.render('register')
}


static handleRegister(req, res) {
  console.log(req.body)
  let { fullName, gender, birthdate, email, password } = req.body
  User.create({ fullName, gender, birthdate, email, password })
    .then(newUser => {
      res.redirect('/login')
    })
    .catch(err => res.send(err))
}


static loginForm(req, res) {
  res.render('login')
}

static handleLogin(req, res) {
  const { email, password } = req.body

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        const isValidPass = bcrypt.compareSync(password, user.password)

        if (isValidPass) {
          req.session.user = user.id
          req.session.isAdmin = user.isAdmin
          return res.redirect(user.isAdmin ? '/admin/user' : '/home')
        } else {
          const error = `invalid username/password`
          return res.redirect(`/login?error=${error}`)
        }
      } else {
        const error = `invalid username/password`
        return res.redirect(`/login?error=${error}`)
      }
    })
    .catch(err => res.send(err))
}

static logout(req, res) {
  req.session.destroy((err) => {
    if (err) console.log(err)
    else {
      res.redirect('/login')
    }
  })
}


static async adminDashboardUser(req, res){
  try {
    const user = await User.findAll()

    res.render('adminDashboardUser', {user})
  } catch (error) {
    res.send(error)
  }
}

static async adminDashboardPost(req, res){
  try {
    const user = await User.findAll()

    res.render('adminDashboardPost', {user})
  } catch (error) {
    res.send(error)
  }
}

static async homePage(req, res){
  try { 
    let id = req.session.user
    // console.log(req.session.user)
    const user = await User.findByPk(id)
    // console.log(user, 'ini user')
    res.render('timeline1', {user}) 
  } catch (error) {
    res.send(error)
  }
}

static async userProfile(req, res){
  try {
    let id = req.session.user
    const edit = await User.findByPk(id)
    const profile = await Profile.findOne({
      where: {
        UserId: id
      }
    })
    // console.log(profile)

    // console.log(edit, 'iniiii')
    res.render('userProfile', {edit, profile})
  } catch (error) {
    res.send(error)
  }
}

static async profileSetup(req, res) {
  try {
    // console.log(req.session.user, '<<<<')
    let id = req.session.user
    let user = await User.findByPk(id)

    res.render('profileSetup', {user, reversedDate})
  } catch (error) {
   res.send(error) 
  }
}

static async handleSetup(req, res){
  try {
    let UserId = req.session.user
    console.log(req.body)
    let {fullName, nickName, username, birthdate, gender, profilePict} = req.body

    await Profile.create({fullName, nickName, username, birthdate, gender, profilePict, UserId})
    res.redirect(`/user/${UserId}/profile`)
    
  } catch (error) {
    res.send(error)
  }
}

}
module.exports = Controller