const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies=Models.Movie;
const Users=Models.User;
const Genres=Models.Genre;
const Directors=Models.Director;


// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

let logger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(logger);

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});


// READ
//Get movies
app.get('/movies', (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
// Get all users
app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//searches for movies by their title and returns a  single JSON object
app.get('/movies/:title', (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//searches for movies by their genre and returns a JSON object
app.get('/movies/genres/:genreName', (req, res) => {
    Movies.find({ 'Genre.Name': req.params.genreName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  });
  
  //searches for movies by the directors name and returns the movies with that directors name
  app.get('/movies/directors/:directorsName', (req, res) => {
    Movies.find({ 'Director.Name': req.params.directorsName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  });
//creates a new user and adds them to the list of users.
app.post('/users', (req, res) => {
    Users.findOne({ Name: req.body.Name }).then((user) => {
      if (user) {
        return res.status(400).send(req.body.Name + 'already exists');
      } else {
        Users.create({
          Name: req.body.Name,
          Email: req.body.Email,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    });
  });
  
  //allows users to save movies to their favorites!
  app.post('/users/:Name/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $addToSet: { FavoriteMovies: req.params.MovieID }
      },
      { new: true } //This line makes sure the updated document is returned
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });
  
  //deletes a user by username
  app.delete('/users/:Name', (req, res) => {
    Users.findOneAndRemove({ Name: req.params.Name })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Name + ' was not found');
        } else {
          res.status(200).send(req.params.Name + ' was deleted');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
  //allows users to delete movies from their favorites
  app.delete('/users/:Name/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $pull: { FavoriteMovies: req.params.MovieID }
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
//updates a account holders information
app.put('/users/:Name', (req, res) => {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $set: {
          Name: req.body.name,
          Email: req.body.Email,
          Gender: req.body.Gender,
          Birthday: req.body.Birthday,
          Address: req.body.Address,
          Phone: req.body.Phone
        }
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error!');
});

  
// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));