const Sauce = require("../models/Sauce");
const fs = require("fs");

//Créé une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(
    req.body.sauce
  ); /*annalyse la chaine de caractère et intègre la valeur Javascript*/
  delete sauceObject._id; /*ont enleve l'ID du corp de la requête car il sera générer par mongoDB*/

  const sauce = new Sauce({
    /*création d'une nouvelle instance de mon model Sauce*/
    ...sauceObject /*l'opérateur spread copie les champs du corps de la requête*/,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    /*Initialisation des données*/
    likes: 0,
    dislike: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save() /*ont enregistre l'objet dans la BDD*/
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifié!" }))
    .catch((error) => res.status(400).json({ error }));
};

//Supprime une sauce avec l'_id fourni
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const fileName = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${fileName}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé!" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//Renvoie une seul sauce avec l'id fourni
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//Renvoie un tableau de toutes les sauces de la BDD
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Gestion des likes dislike
// exports.likeSauce = (req, res, next) => {};
