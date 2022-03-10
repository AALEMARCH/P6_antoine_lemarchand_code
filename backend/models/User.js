// Importation de mongoose et uniqueValidator
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création du schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Ajout du validateur en tant que plugin avant l'export du modèle User
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
