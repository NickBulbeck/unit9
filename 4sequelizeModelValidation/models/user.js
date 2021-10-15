'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt'); // we need this for the confirmed password thing

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    /*  If a validate:{} hingmy fails, it fails at the Sequelize level - that is, a
        SQL query will not be sent to the database. Whereas a *constraint* is checked
        at the SQL level; if this fails, the database throws an error and Sequelize
        passes it back to us.
        A good example of this is the check that an email is unique. Sequelize itself
        cannot possibly know this; it can weed out emails that aren't valid, but it won't
        know whether a valid email is in the database or not.
    */ 
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { // Obviously, this is only allowed if allowNull: false is already specified
          msg: 'A name is required'
        },
        notEmpty: { // If the value is "". If it's not set up at all, it's null (handled above).
          msg: 'Please provide a name'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email you entered already exists'
      },
      validate: {
        notNull: {
          msg: 'An email is required'
        },
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A birthday is required (MM-DD-YYYY)'
        },
        isDate: {
          msg: 'Your birthday must be a valid date (MM-DD-YYYY)'
        }
      }
    },
    password: {
      type: DataTypes.VIRTUAL,  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length'
        }
      }
    },
    confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) { // `val` is equivalent to `event` or `error` - it's foadyb, and labels the value
        if ( val === this.password ) { // which itself is passed in automatically by the function.
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confirmedPassword', hashedPassword);
        }
      },
      validate: { // If they don't match, set(val) won't finish and SQL will try to store a null 
        notNull: { // value. So you need to stop this happening.
          msg: 'Both passwords must match'
        }
      }
    }
  }, { sequelize });

  return User;
};