//importation de password_validator
const passwordValidator = require("password-validator");

//création du schéma
const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(7) // minimum 8 caractères
  .is()
  .max(100) // maximum 100 caractères
  .has()
  .uppercase() // il doit y avoir des majuscules
  .has()
  .lowercase() // il doit y avoir des minuscules
  .has()
  .digits(2) // minimum deux chiffres
  .has()
  .not()
  .spaces() // pas d'éspaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // mot de passe interdit

//Vérification du password par rapport au schéma
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res
      .status(400)
      .json({
        error: `Le mot de pase n'est pas asez fort: ${passwordSchema.validate(
          "req.body.password",
          { list: true }
        )}`,
      });
  }
};
