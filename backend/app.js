const express = require("express");

//les routes sauces et utilisateurs
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

//importation de mongoose
const mongoose = require("mongoose");

//donne acces au chemin du systeme de fichier
const path = require("path");

//package dotenv (variable d'environnement)
const dotenv = require("dotenv");
dotenv.config();

//importation du package de limite de débit
const rateLimit = require("express-rate-limit");

/*importation de helmet - aide à protéger l'application de certaines des vulnérabilités connues du Web en configurant de manière appropriée des en-têtes HTTP*/
const helmet = require("helmet");

//connexion à la BDD
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yptro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// limite le nombre de requêtes par IP envoyées vers le server Express
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par `window` de 15 minutes
  standardHeaders: true, // Renvoie les informations de limite de débit dans les en-têtes
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});

//Méthodes express
const app = express();
app.use(limiter); // Applique le middleware de limitation de débit à toutes les requêtes
app.use(helmet());

//gestion des CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//conversions JSON a la place de body parser
app.use(express.json());

//gestion des images
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;
