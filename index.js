const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('tiny'));

// Define your top 10 movies
const topMovies = [
  { title: 'The Godfather', director: 'Francis Ford Coppola' },
  { title: 'The Shawshank Redemption', director: 'Frank Darabont' },
  { title: 'The Dark Knight', director: 'Christopher Nolan' },
  { title: 'Pulp Fiction', director: 'Quentin Tarantino' },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', director: 'Peter Jackson' },
  { title: 'Forrest Gump', director: 'Robert Zemeckis' },
  { title: 'Star Wars: Episode IV - A New Hope', director: 'George Lucas' },
  { title: 'Inception', director: 'Christopher Nolan' },
  { title: 'The Matrix', director: 'Lana Wachowski, Lilly Wachowski' },
  { title: 'Goodfellas', director: 'Martin Scorsese' }
];

// Define your GET route at the "/movies" endpoint
app.get('/movies', (req, res) => {
  // Return the JSON object containing data about your top 10 movies
  res.json(topMovies);
});

//Create another GET route located at the endpoint “/” that returns a default textual response of your choosing.
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
