// Importation de passwordValidator
const passwordValidator = require("password-validator");

// Création du schéma
const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(7) // Minimum 8 caractères
  .is()
  .max(100) // Maximum 100 caractères
  .has()
  .uppercase() // Il doit y avoir des majuscules
  .has()
  .lowercase() // Il doit y avoir des minuscules
  .has()
  .digits(2) // Minimum deux chiffres
  .has()
  .not()
  .spaces() // Pas d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Mot de passe interdit

// Vérification du password par rapport au schéma
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Le mot de pase n'est pas asez fort: ${passwordSchema.validate(
        "req.body.password",
        { list: true }
      )}`,
    });
  }
};
