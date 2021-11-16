const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; //retire le champs id du corps de la requête
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

//modifier sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

//supprimer sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];// on extrait le nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => {// on le supprime grâce à fs.unlink
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'objet supprimé!' }))
                    .catch(error => res.status(404).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};
//recuperer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//recuperer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeDislike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })           // on récupère les informations de la sauce
        .then(sauce => {

            switch (req.body.like) {                // selon la valeur recue pour 'like' dans la requête
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId)) {  //si usersDisliked n'inclut pas l'userId
                        Sauce.updateOne({ _id: req.params.id }, {           // on met à jour la sauce
                            $inc: { dislikes: 1 },                             // incrémentation +1 dislike
                            $push: { usersDisliked: req.body.userId },        // on ajoute le userId dans le tableau des utilisateurs qui dislike la sauce
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: 'Dislike ajouté !' }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    break;

                case 0:                                                                 // si l'utilisateur enlève son like ou son dislike
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {      // si l'utilisateur est trouvé dans le tableau des like
                        Sauce.updateOne({ _id: req.params.id }, {                      // on met à jour la sauce
                            $inc: { likes: -1 },                                           // incrémentation -1 like
                            $pull: { usersLiked: req.body.userId },                       // on retire le userId dans le tableau des utilisateurs qui like la sauce
                        })
                            .then(() => res.status(201).json({ message: 'Like retiré !' }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {   // si l'utilisateur est trouvé dans le tableau des dislike
                        Sauce.updateOne({ _id: req.params.id }, {                      // on met à jour la sauce
                            $inc: { dislikes: -1 },                                        // incrémentation -1 dislike
                            $pull: { usersDisliked: req.body.userId },                    // on retire le userId dans le tableau des utilisateurs qui dislike la sauce
                        })
                            .then(() => res.status(201).json({ message: 'Dislike retiré !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case 1: // si l'utilisateur dislike la sauce
                    if (!sauce.usersLiked.includes(req.body.userId)) {       //si usersLiked n'inclut pas l'userId                          
                        Sauce.updateOne({ _id: req.params.id }, {                           // on met à jour la sauce
                            $inc: { likes: 1 },                                               // incrémentation +1 like
                            $push: { usersLiked: req.body.userId },                          // on ajoute le userId dans le tableau des utilisateurs qui like la sauce
                        })
                            .then(() => res.status(201).json({ message: 'Like ajouté !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                default:                                                                // si aucun des cas précédent n'est trouvé
                    return res.status(500).json({ error });
            }
        })
        .catch(error => res.status(500).json({ error }))
};



