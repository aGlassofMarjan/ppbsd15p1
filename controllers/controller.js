const {User, Profile, Category, Post, Interaction} = require('../models')

class Controller {

static async landingPage(req, res){
  try { 
    res.render('landingpage')
  
  } catch (error) {
    res.send(error)
  }
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
    
    

    res.render('timeline')
    
  } catch (error) {
    res.send(error)
  }
}

static async 

}
module.exports = Controller