const routers = require('express').Router()
const Controller = require('../controllers/controller')

routers.get('/', Controller.landingPage)


module.exports = routers