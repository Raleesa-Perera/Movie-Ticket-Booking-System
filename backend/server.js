const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes')
//const port = 5000;

dotenv.config();
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());

//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect("mongodb://localhost:27017/movie")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));


app.use('/api/movies', movieRoutes);
app.use('/api/user', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
