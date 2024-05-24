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

    get age(){
      let bitrhYear = new Date(this.birthdate).getFullYear()

      let data = Date.now() 
      data = new Date().getFullYear()

      const age = data - bitrhYear

      return age
    }

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
          msg: 'Gender must be filled'
        },
        notNull: {
          notNull: {
            msg: `Gender can't be empty`
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
        },
        isBelow17(){
          const age = this.age
          if (age < 17){
            throw new Error(`Age must be over 17 years`)
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