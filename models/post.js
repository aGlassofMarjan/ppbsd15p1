"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static time(num) {
      const timeDiff = new Date().getTime() - new Date(num).getTime();
      const minutes = Math.floor(timeDiff / 60000);
      if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
      }
    }
    static associate(models) {
      // define association here
      this.hasMany(models.Interaction);
      this.belongsTo(models.Profile);
      this.belongsToMany(models.Profile, {
        through: models.Interaction,
      });
    }
  }
  Post.init(
    {
      imgURL: DataTypes.TEXT,
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Content must be filled",
          },
          notNull: {
            msg: "Content can't be empty",
          },
        },
      },
      ProfileId: DataTypes.INTEGER,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title must be filled",
          },
          notNull: {
            msg: "Title can't be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
