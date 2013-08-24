// Structure
//   owner : créateur de la session (son id sans la base des users)
//   nom : nom de la session
//   date : date de la session
//   heure : horaire de la session
//   lieu : lieu de la session
//   jeux : jeux présents pour la session
//   nb_places : nombre de places disponibles
//   description : un petit texte de présentation
//   participants : liste des participants à la session, avec leur réponse (leurs ids toujours)
//   public : un booléen mis à vrai pour une session publique, faux pour une privée

Dosage = new Meteor.Collection('sessions_dose');
