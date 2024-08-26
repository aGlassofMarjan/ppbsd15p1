const { User, Profile, Post, Category } = require("../models");
const { Op } = require("sequelize");
const { readFile } = require("fs").promises;

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
      let { search, category } = req.query;
      let id = req.session.user;

      let option = {
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Profile,
          },
          {
            model: Category,
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

      if (category) {
        option.include.push({
          model: Category,
          where: { name: category },
        });
      }

      const posts = await Post.findAll(option);
      const post = posts.map((el) => el.get({ plain: true }));

      const user = await User.findByPk(id, {
        include: [
          {
            model: Profile,
          },
        ],
      });

      const categories = JSON.parse(
        await readFile("./data/category.json", "utf-8")
      );

      res.render("Timeline", { user, post, Post, categories });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = PublicController;
