const express = require("express");

//importation de mongoose
const mongoose = require("mongoose");

//donne acces au chemin du systeme de fichier
const path = require("path");

//les routes sauces et utilisateurs
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

//lancement de express
const app = express();

//connexion à la BDD
mongoose
  .connect(
    "mongodb+srv://AntoineL:RHkgsAStOFLHGo22@cluster0.yptro.mongodb.net/Projet6?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

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
