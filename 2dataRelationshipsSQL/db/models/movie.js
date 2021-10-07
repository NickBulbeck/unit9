'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Movie extends Sequelize.Model {}
  Movie.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    releaseYear: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, { sequelize });

  Movie.associate = (models) => {
// Note: the foreign key, directorPersonId, is added by Sequelize to the three
// attributes directly added above (that is, id, title and releaseYear).
    Movie.belongsTo(models.Person,
      { as: 'director', // must have an equivalent in Person
        foreignKey:
          {fieldName:'directorPersonId',
          allowNull : false
        }
      }
    );
  };

  return Movie;
};
