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
      const now = new Date();
      const then = new Date(num);
      const timeDiff = now.getTime() - then.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30); // Roughly 30 days in a month
      const years = Math.floor(days / 365); // Roughly 365 days in a year

      if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
      } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
      } else if (days < 7) {
        return `${days} day${days !== 1 ? "s" : ""} ago`;
      } else if (weeks < 4) {
        return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
      } else if (months < 12) {
        return `${months} month${months !== 1 ? "s" : ""} ago`;
      } else if (years < 1) {
        return `${now.getDate().toString().padStart(2, "0")}-${(
          now.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${now.getFullYear().toString().slice(-2)}`;
      } else {
        return `${then.getDate().toString().padStart(2, "0")}-${(
          then.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${then.getFullYear().toString().slice(-2)}`;
      }
    }

    static associate(models) {
      // define association here
      this.hasMany(models.Interaction);
      this.belongsTo(models.Profile);
      this.belongsTo(models.Category, { foreignKey: "CategoryId" }); // Add this line
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
      CategoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            msg: "Category can't be empty",
          },
          notEmpty: {
            msg: "Category must be filled",
          },
        },
        references: {
          model: "Categories",
          key: "id",
        },
      },
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
