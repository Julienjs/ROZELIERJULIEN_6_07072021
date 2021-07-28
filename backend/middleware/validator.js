const { body, validationResult } = require('express-validator');

const rules = () => {
    return [
        body('email').isEmail()
            .trim()
            .escape()
            .normalizeEmail(),//normalizeEmail() garantit que l'adresse e-mail est dans un format sûr et standard.
        body('password').isLength({ min: 8 })
            .withMessage('Le mot de passe doit contenir au moins 8 caractères !')
            .matches('[0-9]').withMessage('Le mot de passe doit contenir au moins un chiffre!')
            .matches('[A-Z]').withMessage('Le mot de passe doit contenir au moins une majuscules')
            .trim()//trim()supprime les caractères de l'entrée. Par défaut (sans paramètres), cette méthode supprime les espaces.
            .escape()
    ]
}
const validate = (req, res, next) => {
    //escape()remplacera certains caractères (ie <, >, /, &, ', ") par l'entité HTML correspondante.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        next()
    }
};

module.exports = { rules, validate };