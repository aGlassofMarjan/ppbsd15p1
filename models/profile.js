'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User)
      this.hasMany(models.Interaction)
      this.belongsToMany(models.Post,{
        through: models.Interaction
      })


    }
  }
  Profile.init({
    gender: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    fullName: DataTypes.STRING,
    profilePict: DataTypes.TEXT,
    nickName: DataTypes.STRING,
    username: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};