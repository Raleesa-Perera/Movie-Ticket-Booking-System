const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();
//const {SendMovieSeatsSelection} = require("../controllers/MovieController");

//router.post(`/movie/${movieTitle}/seatselection`, SendMovieSeatsSelection);

router.get('/', async (req, res) => {
    try {
      const movies = await Movie.find(); 
      res.json(movies); 
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/movie/:movieTitle', async (req, res) => {
  const movieTitle = req.params.movieTitle;
  try {
    const movie = await Movie.findOne({ title: { $regex: new RegExp(`^${movieTitle}$`, 'i') } });
    
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/movie/:movieTitle/seatselection', async (req, res) => {
  const movieTitle = req.params.movieTitle;
  try {
    const movie = await Movie.findOne({ title: { $regex: new RegExp(`^${movieTitle}$`, 'i') } });
    
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;