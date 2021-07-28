const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    //grace au middleware precedent maintenant nous avons accès au corps de la requête
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;//retire le champs id du corps de la requête
    const sauce = new Sauce({
        ...sauceObject,// spread(...) est un opérateur qui copie tout les élément de la requete body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()//method save enregistre l'objet dans la base et retourne la promise
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};
//modifier objet
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
//supprimer objet
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'objet supprimé!' }))
                    .catch(error => res.status(404).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};
//recuperer un seul objet
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        //findOne pour trouver un objet 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
//recuperer tout les objets
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeDislike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let like = req.body.like;
            let choice = {};
            switch (like) {
                case -1:
                    choice = { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } };
                    break;
                case 0:
                    for (let userId of sauce.usersDisliked) {
                        if (req.body.userId === userId) {
                            choice = { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } };
                        };
                    };
                    //let produitTrouve = panier.find(p => p._id == produit._id && p.color == produit.color);
                    for (let userId of sauce.usersLiked) {
                        if (req.body.userId === userId) {
                            choice = { $pull: { usersLiked: userId }, $inc: { likes: -1 } };
                        };
                    };
                    break;
                case 1:
                    choice = { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } };
            }
            Sauce.updateOne({ _id: req.params.id }, choice)
                .then(() => res.status(200).json({ message: "aime" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// exports.addLikes = (req, res, next) => {
//     const like = req.body.like;
//     const dislike = req.body.dislike;
//     const userId = req.body.userId;

//     Sauce.findOne({ _id: req.params.id })
//         .then(sauce => {
//             switch (like) {
//                 case 1:
//                     Sauce.updateOne(
//                         { _id: req.params.id },
//                         { $push: { userLiked: userId }, $inc: { likes: 1 } }
//                     )
//                         .then(() => res.status(200).json({ message: 'objet liké' }))
//                         .catch(error => res.status(404).json({ error }));
//                     break;
//             }
//             switch (dislike) {
//                 case -1:
//                     Sauce.updateOne(
//                         { _id: req.params.id },
//                         { $push: { userDisliked: userId }, $inc: { dislikes: 1 } }
//                     )
//                         .then(() => res.status(200).json({ message: 'objet pas aimé' }))
//                         .catch(error => res.status(404).json({ error }));
//                     break;
//             }
//         });
// }


