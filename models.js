const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String,
      Birth: String,
      Death: String
    },
    ImagePath: String,
    Featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Email: {type: String, required: true},
    Gender: String,
    Birthday: Date,
    Address: String,
    Phone: String,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;

 // mongoose.connect('mongodb://localhost:3000/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });