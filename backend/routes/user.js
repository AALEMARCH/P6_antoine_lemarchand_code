const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const emailControle = require("../middleware/emailControle");
const password = require("../middleware/password");

// Création des routes utilisateurs
router.post("/signup", emailControle, password, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
