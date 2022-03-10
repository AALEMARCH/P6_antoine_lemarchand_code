// Contrôleur pour le like et dislike

// Imports du modèle de sauce à liker
const Sauce = require("../models/Sauce");

exports.likeSauce = (req, res, next) => {
  console.log("je suis dans le controllers like");

  const userId = req.body.userId; // Id utilisateur qui se trouve dans le corps de la requête
  const sauceId = req.params.id; // Id de l'objet envoyait dans l'url de la requête
  const likes = req.body.like; // Statut likes qui se trouve dans le corps de la requête

  // Mise en place d'un switch case() pour les cas de like et dislike
  switch (likes) {
    case 1:
      // Ajout d'un like
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { likes: +1 }, // Opérateur qui permet l'incrément de 1 avec la fonction updateOne (doc MongoDb)
          $push: { usersLiked: userId }, // Opérateur mgdb qui inclut la valeur dans le tableau UsersLiked
        }
      )
        .then(() => res.status(201).json({ message: "Ajout du like !" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case -1:
      // Ajout d'un dislike
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { dislikes: +1 },
          $push: { usersDisliked: userId },
        }
      )
        .then(() => res.status(201).json({ message: "Ajout d'un dislike ! " }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case 0:
      // Suppression like dislike si le client annule son choix
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          // Like = 0 (likes = 0, pas de vote)
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId }, // Supprime du tableau la valeur de usersLiked
              }
            )
              .then(() => res.status(201).json({ message: "like supprimé !" }))
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: userId },
              }
            )
              .then(() =>
                res.status(201).json({ message: "dislike supprimé ! " })
              )
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(403).json({ message: "requête impossible !" });
          }
        })
        .catch(() => res.status(404).json({ message: "Sauce introuvable !" }));
      break;
  }
};
