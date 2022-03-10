const express = require("express");

// les routes sauces et utilisateurs
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Importation de mongoose
const mongoose = require("mongoose");

// Donne accès au chemin du système de fichiers
const path = require("path");

// Package dotenv (variable d'environnement)
const dotenv = require("dotenv");
dotenv.config();

// Importation du package de limite de débit
const rateLimit = require("express-rate-limit");

// Importation de helmet - aide à protéger l'application de certaines des vulnérabilités connues du Web en configurant de manière appropriée des en-têtes HTTP
const helmet = require("helmet");

// Connexion à la BDD
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yptro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Limite le nombre de requêtes par IP envoyées vers le serveur Express
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par `window` de 15 minutes
  standardHeaders: true, // Renvoie les informations de limite de débit dans les en-têtes
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});

// Méthodes express
const app = express();
app.use(limiter); // Applique le middleware de limitation de débit à toutes les requêtes
app.use(helmet());

// Gestion des CORS
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
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Conversions JSON à la place de body parser
app.use(express.json());

// Gestion des images
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;
