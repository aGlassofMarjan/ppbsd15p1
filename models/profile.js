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

    get reversedDate() {
      const data = new Date(this.birthdate)
      const year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
    
      if (month < 10) {
        month = '0' + month;
      }
    
      if (day < 10) {
        day = '0' + day
      }
      
      return `${year}-${month}-${day}`
    }
    static associate(models) {
      // define association here
      this.belongsTo(models.User)
      this.hasMany(models.Interaction)
      this.hasMany(models.Post)
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