const { User, Post } = require("../models");

class adminController {
  static async adminDashboardUser(req, res) {
    try {
      const users = await User.findAll({
        where: { isAdmin: false },
      });
      res.render("admindashboard", { users });
    } catch (error) {
      res.send(error);
    }
  }

  static async adminDashboardPost(req, res) {
    try {
      const posts = await Post.findAll({
        include: [{ model: User }],
      });
      res.render("adminDashboardPost", { posts });
    } catch (error) {
      res.send(error);
    }
  }

  static async suspend(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ status: false });
      }
      res.redirect("/admin/user");
    } catch (error) {
      res.send(error);
    }
  }

  static async handleDelete(req, res) {
    try {
      const { postId } = req.params;
      await Post.destroy({
        where: { id: postId },
      });
      res.redirect("/admin/post");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = adminController;
