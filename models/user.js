'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/config.json');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    

    showStatus(){
      let stats
      if (this.status === true){
        stats = 'Active'
      } else {
        stats = 'Suspended'
      }
      // console.log(typeof this.votes)
      return stats
    }

    static associate(models) {
      // define association here
      this.hasOne(models.Profile)
    }
  }
  User.init({
    email:{
    type: DataTypes.STRING,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password must be filled'
        },
        notNull: {
          notNull: {
            msg: `password can't be empty`
          }
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'gender must be filled'
        },
        notNull: {
          notNull: {
            msg: `gender can't be empty`
          }
        }
      }
    },
    birthdate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'birth date must be filled'
        },
        notNull: {
          notNull: {
            msg: `birth date can't be empty`
          }
        }
      }
    },
    fullName:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Full Name must be filled'
        },
        notNull: {
          notNull: {
            msg: `Full Name can't be empty`
          }
        }
      }
    },
    status:{
      type: DataTypes.BOOLEAN,
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(user.password, salt)
        user.status = true
        user.isAdmin = false
      },
    },
  });
  return User;
};