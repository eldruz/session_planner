// Publish fonctions

// On ne publie que les session publiques ou les privées crées par soi-même
Meteor.publish("sessions", function (option) {
  if (this.userId) {
    var choices = {
      future: function() {
        return Dosage.find(
          {$and:[
            {$or: [{"open": true}, {"owner": this.userId}, {"invited": this.userId}]},
            {'date': {$gt: new Date()}}
          ]}
        );
      },
      old: function() {
        return Dosage.find(
          {$and:[
            {$or: [{"open": true}, {"owner": this.userId}, {"invited": this.userId}]},
            {'date': {$lt: new Date()}}
          ]}
        );
      },
      all: function() {
        return Dosage.find(
          {$or: [{"open": true}, {"owner": this.userId}, {"invited": this.userId}]}
        );
      }
    };
    return choices['future']();
  }
  else
    return Dosage.find({"open": true});
});

// On publie le nom des utilisateurs pour pouvoir les afficher en tant que créateur et participants aux sessions
Meteor.publish("users", function() {
  return Meteor.users.find({}, {fields: {username: 1}});
});
