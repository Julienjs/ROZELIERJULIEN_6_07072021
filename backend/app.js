const express = require('express');
const app = express();
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config({ path: './.env' });

// connexion a la base de données 
mongoose.connect('mongodb://' + process.env.DB_USER_PASS + '@cluster0-shard-00-00.cpsid.mongodb.net:27017,cluster0-shard-00-01.cpsid.mongodb.net:27017,cluster0-shard-00-02.cpsid.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-sdpqnq-shard-0&authSource=admin&retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connexion mongo ok'))

    .catch(() => console.log('connexion mongo echouée'));


// les headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
// gestion des routes principales
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;
