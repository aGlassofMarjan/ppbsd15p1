'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Interaction)
      this.belongsTo(models.Profile)
      this.belongsToMany(models.Profile, {
        through: models.Interaction
      })
    }
  }
  Post.init({
    imgURL: DataTypes.TEXT,
    content: DataTypes.TEXT,
    ProfileId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};