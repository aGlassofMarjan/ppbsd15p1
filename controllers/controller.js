const { User, Profile, Category, Post, Interaction } = require('../models')

class Controller {

  static async landingPage(req, res) {
    try {
      res.render('landingpage')
    } catch (error) {
      res.send(error)
    }
  }

}
module.exports = Controller