const express = require('express');
const app = express();
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config({ path: './.env' });

//check est la fonction principale utilisée pour valider et nettoyer les entrées
//Il prend en 2 paramètres optionnels :
//field : le paramètre de champ peut être une chaîne ou un tableau de chaînes représentant les champs de saisie que vous souhaitez vérifier. S'il n'y a pas de valeur de champ, l' ensemble de l'objet de requête sera vérifié.
//message : le paramètre message contient une chaîne qui contient un message d'erreur personnalisé. S'il n'y a pas de valeur de message, le message par défaut est "Valeur invalide".


mongoose.connect('mongodb://' + process.env.DB_USER_PASS + '@cluster0-shard-00-00.cpsid.mongodb.net:27017,cluster0-shard-00-01.cpsid.mongodb.net:27017,cluster0-shard-00-02.cpsid.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-sdpqnq-shard-0&authSource=admin&retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connexion mongo ok'))

    .catch(() => console.log('connexion mongo echouée'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
// transformer le corps de la requete en objet javascript utilisable (Rend les données du corps de la requête exploitable)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;
// exporter la constante app avec export pour que l'on puisse y accéder aux autres fichiers de notre projet