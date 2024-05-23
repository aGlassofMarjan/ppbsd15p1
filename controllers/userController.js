const { User, Profile, Category, Post, Interaction } = require('../models')
const bcrypt = require('bcryptjs')
class userController {

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
            return res.redirect(user.isAdmin ? '/admin/user' : '/user/home')
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


}
module.exports = userController