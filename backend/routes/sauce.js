//importation de express
const express = require("express");

//fonction  Router()
const router = express.Router();

//importation du controleur pour les sauces
const sauceCtrl = require("../controllers/sauce");

//importation du controlleur pour les likes
const likesCtrl = require("../controllers/likes");

//importation du middleware d'authentification
const auth = require("../middleware/auth");

//importation du middlewar multer pour la gestion des images
const multer = require("../middleware/multer-config");

//Création des différentes routes GET POST PUT DELETE
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, likesCtrl.likeSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

//exportation du module
module.exports = router;
