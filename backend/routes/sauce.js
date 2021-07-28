const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//créer un objet
router.post('/', auth, multer, sauceCtrl.createSauce);
//modifier un objet 
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//suppression d'un objet
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);
//recuperer un seul objet
router.get('/:id', auth, sauceCtrl.getOneSauce);
//recuperation tout les objets
router.get('/', auth, sauceCtrl.getAllSauces);

router.post("/:id/like", auth, sauceCtrl.likeDislike);

module.exports = router;