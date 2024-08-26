const { User, Profile, Post } = require("../models");
const { Op } = require("sequelize");

class PublicController {
  static async landingPage(req, res) {
    try {
      res.render("landingpage");
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
            [Op.iLike]: `%${search}%`, // Corrected string interpolation for search term
          },
        };
      }

      const posts = await Post.findAll(option);
      const post = posts.map((el) => el.get({ plain: true }));

      // Fetch user along with their profile
      const user = await User.findByPk(id, {
        include: [
          {
            model: Profile,
          },
        ],
      });

      res.render("Timeline", { user, post, Post });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = PublicController;
