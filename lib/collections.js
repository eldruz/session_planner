// Structure
//   owner : créateur de la session
//   nom : nom de la session
//   date : date de la session
//   heure : horaire de la session
//   lieu : lieu de la session
//   jeux : jeux présents pour la session
//   nb_places : nombre de places disponibles
//   description : un petit texte de présentation
//   participants : pour l'instant un nombre qui s'incrémente, ensuite une liste des participants de la session
//   public : un booléen mis à vrai pour une session publique, faux pour une privée

Dosage = new Meteor.Collection('sessions_dose');

Dosage.allow({
  insert: function (userId, party) {
    return false;
  }
});

Meteor.methods({
  createSession: function (options) {
    check(options, {
      nom: String,
      date: Date,
      lieu: String,
      description: String,
      nb_places: Number
    });

    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in.");

    return Dosage.insert({
      owner: Meteor.user().username, // avoir le nom d'utilisateur choisi au moment de la création du compte
      nom: options.nom,
      date: options.date,
      lieu: options.lieu,
      description: options.description,
      nb_places: options.nb_places,
      participants: []
    });
  } // createSession
});
