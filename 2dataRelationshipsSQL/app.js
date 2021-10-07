'use strict';

const { sequelize, models } = require('./db');
// Note: the destructuring going on here. This is the same as
// const blub = require('./db);
// const sequelize = blub.sequelize;
// const models = blub.models;


// Get references to our models.
const { Person, Movie } = models;

// Define variables for the people and movies.
// NOTE: We'll use these variables to assist with the creation
// of our related data after we've defined the relationships
// (or associations) between our models.
let bradBurrd;
let vinDiesel;
let eliMarienthal;
let craigTNelson;
let hollyHunter;
let theIronGiant;
let theIncredibles;

console.log('Testing the connection to the database...');

(async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log('Connection to the database successful!');

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync({force:true});
    // Add People to the Database
    console.log('Adding people to the database...');
    const peopleInstances = await Promise.all([
      Person.create({
        firstName: 'Brad',
        lastName: 'Burrd'
      }),
      Person.create({
        firstName: 'Vin',
        lastName: 'Diesel'
      }),
      Person.create({
        firstName: 'Eli',
        lastName: 'Marienthal'
      }),
      Person.create({
        firstName: 'Craig T',
        lastName: 'Nelson'
      }),
      Person.create({
        firstName: 'Holly',
        lastName: 'Hunter'
      })
    ]);
    console.log(JSON.stringify(peopleInstances,null,2));
    // Update the global variables for the people instances
    [bradBurrd,vinDiesel,eliMarienthal,craigTNelson,hollyHunter] = peopleInstances;

    // Add Movies to the Database
    console.log('Adding movies to the database...');
    const movieInstances = await Promise.all([
      Movie.create({
        title: 'The Iron Giant',
        releaseYear: 1999,
        directorPersonId: bradBurrd.id
      }),
      Movie.create({
        title: 'The Incredibles',
        releaseYear: 2004,
        directorPersonId: eliMarienthal.id // Actually it was Brad Burrd
      })      
    ]);
    console.log(JSON.stringify(movieInstances,null,2));
    // Retrieve movies
    const movies = await Movie.findAll({
      include: [
        {
          model: Person,
          as: 'director'
        }
      ]
    });
    console.log(movies.map(movie => movie.get({plain:true})));
// NB: .get({plain:true}) is equivalent to calling .toJSON - a
// plain object with the model attributes and values.
    // Retrieve people
    const people = await Person.findAll({
      include: [
        {
          model: Movie,
          as: 'director'
        }
      ]
    });
    console.log(people.map(person => person.get({plain:true})));
    console.log(JSON.stringify(people,null,2));

    process.exit(); // STOP RUN, if you will. With this demo app, there's no
                    // res.render() or similar, so you have to stop the process
                    // manually like this.
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();

/* NOTE on many-to-many:

// Associate `theIronGiant` with these two actors, but don't touch any current associations
theIronGiant.addActors([
  vinDiesel,
  eliMarienthal
]);

// Associate `theIncredibles` with ONLY these two actors, all other associations will be deleted
theIncredibles.setActors([
  craigTNelson,
  hollyHunter,
]);

*/