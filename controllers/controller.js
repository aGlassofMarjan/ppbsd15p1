const { User, Profile, Category, Post, Interaction, sequelize } = require('../models')
const reversedDate = require('../helpers/formatDate')
const bcrypt = require('bcryptjs')
// const { fn, col } = require('sequelize')
const { Op } = require('sequelize')


class Controller {

  static async landingPage(req, res) {
    try {
      res.render('landingpage')

    } catch (error) {
      res.send(error)
    }
  }

  static async registerForm(req, res) {
    try {
      let {errors} = req.query
      if (errors) {
        errors = errors.split(",")
      }
      res.render('register1', {errors})
    } catch (error) {
      res.send(error)
    }
  }


  static async handleRegister(req, res) {
    const { fullName, gender, birthdate, email, password } = req.body;
    
    try {
      const newUser = await User.create({ fullName, gender, birthdate, email, password });
      res.redirect('/login');
    } catch (error) {
      if (error.name === "SequelizeValidationError"){
        
        const msg = error.errors.map(el => el.message)
        // res.send('hai')
        res.redirect(`/register?errors=${msg}`)
      } else {
        res.send(error)
      }
    }
  }
  


  static loginForm(req, res) {
    res.render('login1')
  }

  static handleLogin(req, res) {
    const { email, password } = req.body

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {

          const isValidPass = bcrypt.compareSync(password, user.password)

          if (isValidPass) {
            // if (user.status === false) {
            //   return res.redirect('/suspended');
            // }
            req.session.user = user.id
            req.session.isAdmin = user.isAdmin
            req.session.status = user.status
            // req.session.status = user.status

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

  static async adminDashboardUser(req, res) {
    try {
      const user = await User.findAll({
        where: {
          isAdmin: false
        }
      })

      res.render('adminDashboardUser', { user })
    } catch (error) {
      res.send(error)
    }
  }

  static async adminDashboardPost(req, res) {
    try {
      const post = await Post.findAll({
        include:Profile
      })
      // console.log(post)

      res.render('adminDashboardPost', { post })
    } catch (error) {
      res.send(error)
    }
  }

  static async homePage(req, res) {
    try {
      // console.log(req.query)
      let { search } = req.query
      let id = req.session.user

      // const time = await Post.time(num)
      let option = {
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Profile
          }
        ]
      }
      if (search) {
        option.where = {
          title: {
            [Op.iLike]: `%${search}%`
          }
        }
      }
      // console.log(req.params, '<<<<')

      let post = await Post.findAll(option)


      const user = await User.findByPk(id)
      res.render('timeline1', { user, post, Post })
    } catch (error) {
      res.send(error)
    }
  }

  static async userProfile(req, res) {
    try {
      let id = req.session.user
      const edit = await User.findByPk(id)
      const profile = await Profile.findOne({
        where: {
          UserId: id
        }
      })
      // console.log(profile)
      const post = await sequelize.query(`SELECT *
      FROM "Profiles" p
      JOIN "Posts" p2 ON p2."ProfileId" = p.id 
      WHERE p."UserId" = 2 ORDER BY p."createdAt" ASC `)
      // console.log(profile)
      // console.log(profile.Posts.length, "iiiiiii")
      if(profile){
        res.render('userprofile1', { edit, profile, Post, post })
      }else {
        res.redirect(`/user/${id}}/profile/setup`)
      }
      // console.log(profile.Posts)

      // console.log(edit, 'iniiii')
    } catch (error) {
      res.send(error)
    }
  }

  static async profileSetup(req, res) {
    try {
      // console.log(req.session.user, '<<<<')
      let id = req.session.user
      let user = await User.findByPk(id)

      res.render('edituser', { user, reversedDate })
    } catch (error) {
      res.send(error)
    }
  }

  static async handleSetup(req, res) {
    try {
      let UserId = req.session.user
      let { fullName, nickName, username, birthdate, gender, profilePict } = req.body

      await Profile.create({ fullName, nickName, username, birthdate, gender, profilePict, UserId })
      res.redirect(`/user/${UserId}/profile`)

    } catch (error) {
      res.send(error)
    }
  }

  static async postContent(req, res) {
    try {
      let id = req.session.user
      const profile = await Profile.findOne({
        where: {
          UserId: id
        }
      })
      if (req.session.status === false) {
        res.redirect('/suspended')
      } else {
        let id = req.session.user
        // console.log(id, '<<<<<<<<')
        let profile = await Profile.findOne({
          where: {
            UserId: id
          }
        })
        // const category = await Category.findAll()
        // console.log(profile, '<<<<<')
        if(profile){
          res.render('posthandler', { profile })
        } else {
        res.redirect(`/user/${id}/profile/setup`)
      }
    }
        
    } catch (error) {
      res.send(error)
    }
  }

  static async handlePost(req, res) {
    try {
      let ProfileId = req.params.profileId
      let { title, imgURL, content } = req.body

      await Post.create({ title, imgURL, content, ProfileId })
      res.redirect('/home')
      // console.log(req.params)
      // console.log(req.body)
    } catch (error) {
      res.send(error)
    }
  }

  static async postDetail(req, res) {
    try {
      // console.log(req.params, 'iniiiiii')
      let { postId } = req.params

      let id = req.session.user
      // console.log(req.params)
      const post = await Post.findOne({
        where: {
          id: postId
        },
        include: {
          model: Profile,
          include: {
            model: User
          }
          // where: {
          //   UserId: id
          // }
        }
      })
      console.log(post.Profile.User.id,'<<<<')
      if (!post) {
        throw new Error('Post not found')
      }
      const likeCount = await Interaction.count({
        where: {
            PostId: postId,
            like: true,
        }
    })
      // console.log(likeCount)

      res.render('postdetail', { post, Post, likeCount })
    } catch (error) {
      res.send(error)
    }
  }

  static async suspend(req, res) {
    try {
      let { userId } = req.params

      const user = await User.findOne({
        where: {
          id: userId
        }
      })

      if (user) {
        await User.update(
          { status: false },
          {
            where: {
              id: user.id
            }
          }
        );
      }
      res.redirect('/admin/user')
      // console.log(req.params)
    } catch (error) {
      res.send(error)
    }
  }

  static async handleSuspend(req, res) {
    try {
      res.render('410error')
    } catch (error) {
      res.send(error)
    }
  }

  static async handleLike(req, res) {
    try {
      console.log(req.params)
      let id = req.session.user
      const { PostId } = req.params
      const isProfile = await Profile.findOne({
        where: {
          UserId: id
        }
      })
      if(isProfile){

        const post = await Post.findOne({ where: { id: PostId } })
  
        if (!post) {
          throw new Error('Post not found')
        }
  
        // Retrieve the associated profile of the post
        const profile = await Profile.findOne({ where: { id: post.ProfileId } });
  
        if (!profile) {
          throw new Error('Profile not found')
        }
  
        let interaction = await Interaction.findOne({
          where: { ProfileId: profile.id, PostId: post.id },
        })
  
        if (!interaction) {
          console.log('aaaa')
          interaction = await Interaction.create({ like: true, ProfileId: profile.id, PostId: post.id });
        }
  
        res.redirect(`/post/${PostId}/detail`)
      }

    } catch (error) {
      res.send(error)
    }
  }

  static async handleDelete(req, res){
    try {
      console.log(req.params)
      let { postId } = req.params
      await Interaction.destroy({
        where: {
          PostId: postId
        }
      })
      await Post.destroy({
        where: {
          id: postId
        }
      })
      res.redirect('/admin/post')

    } catch (error) {
      res.send(error)
    }
  }

  static async profileEdit(req,res){
    try {
      let id = req.session.user
      let profile = await Profile.findOne({
        where: {
          UserId: id
        }
      })
      // console.log(profile)
      res.render('editOldProfile', {profile})
    } catch (error) {
      res.send(error)
    }
  }
  static async handleEdit(req,res){
    try {
      // console.log(req.body)
      let id = req.session.user
      let {fullName, nickName, profilePict, birthdate, gender} = req.body

      await Profile.update({fullName, nickName, profilePict, birthdate, gender}, {
        where: {
          UserId: id
        }
      })
      res.redirect(`/user/${id}/profile`)
      
    } catch (error) {
      res.send(error)
    }
  }

}
module.exports = Controller