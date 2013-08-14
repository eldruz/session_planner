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

Dosage.allow({
  insert: function (userId, party) {
    return false;
  },
  update: function (userId, session, fields, modifier) {
    if (userId !== session.owner)
      return false; // il faut avoir crée la session pour la modifier

    var allowed = ["nom", "description", "date", "lieu", "open"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    return true;
  },
  remove: function (userId, session) {
    return session.owner === userId;
  }
});

Meteor.methods({
  createSession: function (options) {
    check(options, {
      nom         : String,
      date        : Date,
      lieu        : String,
      description : String,
      nb_places   : Number,
      open        : Match.Optional(Boolean)
    });

    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in.");

    return Dosage.insert({
      owner        : this.userId,
      nom          : options.nom,
      date         : options.date,
      lieu         : options.lieu,
      description  : options.description,
      nb_places    : options.nb_places,
      open         : !! options.open,
      participants : [],
      rsvps        : [],
      invited      : []
    });
  }, // createSession
  participeSession: function (sessionId, rsvp) {
    check(sessionId, String);
    check(rsvp, String);
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in.");
    if (!_.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");

    var session = Dosage.findOne(sessionId);
    if (!session)
      throw new Meteor.Error(404, "Session fantôme");

    // Si le rsvp est oui, qu'il existe déjà ou non on ne l'accepte pas si le nombre maximal de participants est atteint
    var count = _.where(session.participants, {rsvp: 'yes'}).length;
    if (rsvp === 'yes' && count === session.nb_places)
      throw new Meteor.Error(400, "Limite des places disponibles atteinte");

    // On vérifie si le rsvp existe déjà
    var rsvpIndex = _.indexOf(_.pluck(session.participants, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry
      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Dosage.update(
          {_id: sessionId, "participants.user": this.userId},
          {$set: {"participants.$.rsvp": rsvp}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["participants." + rsvpIndex + ".rsvp"] = rsvp;
        Dosage.update(sessionId, modifier);
      }
    } else {
      Dosage.update(sessionId, {$push: {participants: {user: this.userId, rsvp: rsvp}}});
    }
  },
  invite: function(sessionId, userId) {
    check(sessionId, String); check(userId, String);
    var session = Dosage.findOne(sessionId);
    if (!session || session.owner !== this.userId)
      throw new Meteor.Error(404, "No such session");

    if (userId !== session.owner && ! _.contains(session.invited, userId)) {
      Dosage.update(sessionId, { $addToSet: { invited: userId } });
    }
  }
});
