const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  cors = require('cors'),
  bcrypt = require('bcrypt'),
  { check, validationResult } = require('express-validator'),
  ServerPort = 8080;


const passport = require('passport');
require('./authentication/passport.js');



const app = express();
app.use(cors());

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlix', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Middleware functions
let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};
//Use the Morgan middleware library to log all requests 
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));




app.use(methodOverride());
// Use express.static to serve your “documentation.html”
app.use(express.static('public'));
app.use(express.static('__dirname'));
app.use(myLogger);

//Authentication & Authorization
let auth = require('./authentication/auth.js')(app);

//Reture a Movie list to home page


// Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to my movie database!');
});


app.get('/movies', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


//Return a list of ALL genre to the user
app.get('/movies/genre', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Genres.find()
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });

});

// Return data about a genre (description) by name (e.g., "Thriller")
app.get('/movies/genre/:name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  // res.send('Hello World!');
  Genres.findOne({
      name: req.params.name
    })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      //   console.error('Sorry this movie genre is not available');
      res.status(500).send('Sorry this movie genre is not available: ' + err);
    });


});


// Gets the data about a movie movies, by name
app.get('/movies/:title', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
      title: req.params.title
    })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Directors.findOne({
      name: req.params.name
    })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error('Sorry this Director is not available');
      res.status(500).send('Error: ' + err);
    });
});


// Adds data for a new movie to our list of movies.
app.post('/movies', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Movies.findOne({
      title: req.body.title
    })
    .then((movie) => {
      if (movie) {
        return res.status(400).send('Movie' + req.body.title + 'already exists');
      } else {
        Movies.create({
            year: req.body.year,
            title: req.body.title,
            ImagePath: req.body.ImagePath,
            genre: req.body.genre,
            description: req.body.description,
            directors: req.body.directors,
            release_date: req.body.release_date,
            featured: req.body.featured
          })
          .then((movie) => {
            res.status(201).json(movie)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });

});


// Update the information in movie by title
app.put('/movies/:title', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Movies.findOneAndUpdate({
      title: req.params.title
    }, {
      $set: {
        year: req.body.year,
        title: req.body.title,
        ImagePath: req.body.ImagePath,
        genre: req.body.genre,
        description: req.body.description,
        directors: req.body.directors,
        release_date: req.body.release_date,
        featured: req.body.featured

      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedMovie);
      }
    });

});


// Delete a movie from the list by Movie Name
app.delete('/movies/:title', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Movies.findOneAndRemove({
      title: req.params.title
    })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.title + ' was not found');
      } else {
        res.status(200).send(req.params.title + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// User Section


// Register New user
app.post('/users', 
 // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('username', 'Username is required').isLength({
      min: 5
    }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    let hashedPassword = Users.hashPassword(req.body.password);

  console.log(req.body);


  Users.findOne({
      username: req.body.username
    })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users
          .create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birth_date: req.body.birth_date
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });

});

//Return users list
app.get('/users', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.find()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOne({
      username: req.params.username
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



// Allow users to update their user info (username)
app.put('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Users.findOneAndUpdate({
      username: req.params.username
    }, {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birth_date: req.body.birth_date
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });


});

//Allow existing users to deregister by username
app.delete('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Users.findOneAndRemove({
      username: req.params.username
    })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Add a favorites movie to a user's list 
app.post('/users/:username/:ObjectId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      username: req.params.username
    }, {
      $push: {
        FavoriteMovies: req.params.ObjectId
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Delete a favorites movie from a user's list 
app.delete('/users/:username/:ObjectId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Users.findOneAndUpdate({
      username: req.params.username
    }, {
      $pull: {
        FavoriteMovies: req.params.ObjectId
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });

});


/* error-handling middleware function that will log all application-level
errors to the terminal */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something Error!!!');
});

// listen for requests
app.listen(ServerPort, '0.0.0.0',() => {
  console.log(`Listening on Port ${ServerPort}`);
});