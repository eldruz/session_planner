Dosage = new Meteor.Collection('sessions_dose');

// Structure
//   nom : nom de la session
//   date : date de la session
//   lieu : lieu de la session
//   jeux : jeux présents pour la session
//   nb_places : nombre de places disponibles
//   description : un petit texte de présentation

if (Meteor.isServer && Dosage.find().count() == 0) {
  var sessions = [
    {nom: 'SacMania', date: new Date(), lieu: 'Rennes', jeux: 'SF4', nb_places: 7, description: 'La session qui décidera enfin de qui est le plus sac de tous parmi les sacs !'},
    {nom: 'BOUBS', date: new Date(), lieu: 'Rennes', jeux: 'SF4', nb_places: 7, description: 'La session qui décidera enfin de qui est le plus sac de tous parmi les sacs !'},
    {nom: 'Lolilol', date: new Date(), lieu: 'Rennes', jeux: 'SF4', nb_places: 7, description: 'La session qui décidera enfin de qui est le plus sac de tous parmi les sacs !'}
  ];
  _.each(sessions, function(session) {
    Dosage.insert(session);
  });
}
