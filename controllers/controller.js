const {
  User,
  Profile,
  Category,
  Post,
  Interaction,
  sequelize,
} = require("../models");
const reversedDate = require("../helpers/formatDate");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

class Controller {
  static async landingPage(req, res) {
    try {
      res.render("landingpage");
    } catch (error) {
      res.send(error);
    }
  }

  static async registerForm(req, res) {
    try {
      let { errors } = req.query;
      if (errors) {
        errors = errors.split(",");
      }
      res.render("Register", { errors });
    } catch (error) {
      res.send(error);
    }
  }

  static async handleRegister(req, res) {
    const { fullName, gender, birthdate, email, password } = req.body;

    try {
      const newUser = await User.create({
        fullName,
        gender,
        birthdate,
        email,
        password,
      });
      res.redirect("/login");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const msg = error.errors.map((el) => el.message);
        res.redirect(`/register?errors=${msg}`);
      } else {
        res.send(error);
      }
    }
  }

  static loginForm(req, res) {
    res.render("Login");
  }

  static handleLogin(req, res) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          const isValidPass = bcrypt.compareSync(password, user.password);

          if (isValidPass) {
            req.session.user = user.id;
            req.session.userEmail = user.email;
            req.session.isAdmin = user.isAdmin;
            req.session.status = user.status;
            return res.redirect(user.isAdmin ? "/admin/user" : "/home");
          } else {
            const error = `invalid username/password`;
            return res.redirect(`/login?error=${error}`);
          }
        } else {
          const error = `invalid username/password`;
          return res.redirect(`/login?error=${error}`);
        }
      })
      .catch((err) => res.send(err));
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.log(err);
      else {
        console.log("berhasil logout");
        res.redirect("/login");
      }
    });
  }

  static async adminDashboardUser(req, res) {
    try {
      const user = await User.findAll({
        include: Profile,
        where: {
          isAdmin: false,
        },
      });

      res.render("admindashboard", { user });
    } catch (error) {
      res.send(error);
    }
  }

  static async adminDashboardPost(req, res) {
    try {
      const post = await Post.findAll({
        include: Profile,
      });

      res.render("adminDashboardPost", { post });
    } catch (error) {
      res.send(error);
    }
  }

  static async homePage(req, res) {
    try {
      let { search } = req.query;
      let id = req.session.user;

      let option = {
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Profile,
          },
        ],
      };
      if (search) {
        option.where = {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }

      const posts = await Post.findAll(option);
      const post = posts.map((el) => el.get({ plain: true }));

      const user = await User.findByPk(id);
      res.render("Timeline", { user, post, Post });
    } catch (error) {
      res.send(error);
    }
  }

  static async userProfile(req, res) {
    try {
      let id = req.session.user;
      // const edit = await User.findByPk(id);
      const user = await User.findByPk(id);
      // console.log(user, "<<<<");
      const post = await sequelize.query(`SELECT *
      FROM "Profiles" p
      JOIN "Posts" p2 ON p2."ProfileId" = p.id 
      WHERE p."UserId" = ${id} ORDER BY p."createdAt" ASC `);

      if (user) {
        res.render("UserProfile", { user, post, Post });
      } else {
        res.redirect(`/user/${id}}/profile/setup`);
      }
    } catch (error) {
      res.send(error);
    }
  }

  static async profileSetup(req, res) {
    try {
      let id = req.session.user;
      let user = await User.findByPk(id);

      res.render("CompleteYourProfile", { user, reversedDate });
    } catch (error) {
      res.send(error);
    }
  }

  static async handleSetup(req, res) {
    try {
      let UserId = req.session.user;
      let { fullName, nickName, username, birthdate, gender, profilePict } =
        req.body;

      await Profile.create({
        fullName,
        nickName,
        username,
        birthdate,
        gender,
        profilePict,
        UserId,
      });
      res.redirect(`/user/${UserId}/profile`);
    } catch (error) {
      res.send(error);
    }
  }

  static async postContent(req, res) {
    try {
      let id = req.session.user;
      const profile = await Profile.findOne({
        where: {
          UserId: id,
        },
      });
      if (req.session.status === false) {
        res.redirect("/suspended");
      } else {
        let id = req.session.user;
        let profile = await Profile.findOne({
          where: {
            UserId: id,
          },
        });
        if (profile) {
          res.render("CreatePost", { profile });
        } else {
          res.redirect(`/user/${id}/profile/setup`);
        }
      }
    } catch (error) {
      res.send(error);
    }
  }

  static async handlePost(req, res) {
    try {
      let ProfileId = req.params.profileId;
      let { title, imgURL, content } = req.body;

      await Post.create({ title, imgURL, content, ProfileId });
      res.redirect("/home");
    } catch (error) {
      res.send(error);
    }
  }

  static async postDetail(req, res) {
    try {
      let { postId } = req.params;

      let id = req.session.user;
      const post = await Post.findOne({
        where: {
          id: postId,
        },
        include: {
          model: Profile,
          include: {
            model: User,
          },
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
      const likeCount = await Interaction.count({
        where: {
          PostId: postId,
          like: true,
        },
      });

      const user = await User.findByPk(id);

      res.render("PostDetail", { post, Post, likeCount, user });
    } catch (error) {
      res.send(error);
    }
  }

  static async suspend(req, res) {
    try {
      let { userId } = req.params;

      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (user) {
        await User.update(
          { status: false },
          {
            where: {
              id: user.id,
            },
          }
        );
      }
      res.redirect("/admin/user");
    } catch (error) {
      res.send(error);
    }
  }

  static async handleSuspend(req, res) {
    try {
      res.render("410error");
    } catch (error) {
      res.send(error);
    }
  }

  static async handleLike(req, res) {
    try {
      console.log(req.params);
      let id = req.session.user;
      const { PostId } = req.params;
      const isProfile = await Profile.findOne({
        where: {
          UserId: id,
        },
      }); // profile dila
      if (isProfile) {
        const post = await Post.findOne({ where: { id: PostId } });

        if (!post) {
          throw new Error("Post not found");
        }

        let interaction = await Interaction.findOne({
          where: { ProfileId: isProfile.id, PostId: post.id },
        });

        if (!interaction) {
          console.log("aaaa");
          interaction = await Interaction.create({
            like: true,
            ProfileId: isProfile.id,
            PostId: post.id,
          });
        } else {
          console.log(interaction.id, "<<< id");
          const result = await Interaction.update(
            { like: !interaction.like },
            {
              where: {
                id: interaction.id,
              },
              returning: true,
            }
          );

          console.log(result, "<<< result");
        }

        res.redirect(`/post/${PostId}/detail`);
      }
    } catch (error) {
      res.send(error);
    }
  }

  static async handleDelete(req, res) {
    try {
      console.log(req.params);
      let { postId } = req.params;
      await Interaction.destroy({
        where: {
          PostId: postId,
        },
      });
      await Post.destroy({
        where: {
          id: postId,
        },
      });
      res.redirect("/admin/post");
    } catch (error) {
      res.send(error);
    }
  }

  static async profileEdit(req, res) {
    try {
      let id = req.session.user;
      let profile = await Profile.findOne({
        where: {
          UserId: id,
        },
      });
      res.render("editOldProfile", { profile });
    } catch (error) {
      res.send(error);
    }
  }
  static async handleEdit(req, res) {
    try {
      let id = req.session.user;
      let { fullName, nickName, profilePict, birthdate, gender } = req.body;

      await Profile.update(
        { fullName, nickName, profilePict, birthdate, gender },
        {
          where: {
            UserId: id,
          },
        }
      );
      res.redirect(`/user/${id}/profile`);
    } catch (error) {
      res.send(error);
    }
  }
}
module.exports = Controller;
