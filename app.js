const express = require('express')
const app = express()
const port = 3000
const routers = require('./routers/index')
const session = require('express-session')


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    sameSite: true //security csrf attack
  }
}))
app.use(routers)


app.listen(port, () => {
  console.log('success port', port)
})