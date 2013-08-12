// Publish fonctions

// On ne publie que les session publiques ou les privées crées par soi-même
Meteor.publish("sessions", function () {
  if (this.userId)
    return Dosage.find({
      $or: [{"open": true}, {"owner": this.userId}, {"invited": this.userId}]
    }, {sort: [["date", "asc"], ["nom", "asc"]]});
  else
    return Dosage.find({"open": true});
});

// On publie le nom des utilisateurs pour pouvoir les afficher en tant que créateur et participants aux sessions
Meteor.publish("users", function() {
  return Meteor.users.find({}, {fields: {emails: 1, username: 1}});
});
