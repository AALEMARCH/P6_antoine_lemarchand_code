// Configuration de multer pour les images
const multer = require("multer"); // Importation de multer

// Dictionnaire d'extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration du chemin et du nom du fichier pour les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Génère nom du fichier, élimine les espaces avec split et join
    const extension = MIME_TYPES[file.mimetype]; // Accès mimetype (ex: image / jpg)
    callback(null, name + Date.now() + "." + extension); // Génère un nom, un time-stamp et une extension
  },
});

// Exportation du middleware multer qui prend en paramètre l'objet storage, single permet de renvoyer un fichier image unique
module.exports = multer({ storage: storage }).single("image");
