// Publish fonctions

// On ne publie que les session publiques ou les privées crées par soi-même
Meteor.publish("sessions", function (option) {
	var userId = this.userId;
  if (userId) {
    var choices = {
      future: function() {
        return Dosage.find(
          {$and:[
            {$or: [{'open': true}, {'owner': userId}, {'invited': userId}]},
            {'date': {$gt: new Date()}}
          ]}
        );
      },
      old: function() {
        return Dosage.find(
          {$and:[
            {$or: [{'open': true}, {'owner': userId}, {'invited': userId}]},
            {'date': {$lt: new Date()}}
          ]}
        );
      },
      all: function() {
        return Dosage.find(
          {$or: [{'open': true}, {'owner': userId}, {'invited': userId}]}
        );
      }
    };
    return choices[option]();
  }
  else
    return Dosage.find({$and: [{"open": true}, {'date': {$gt: new Date()}}]});
});

// On publie le nom des utilisateurs pour pouvoir les afficher en tant que créateur et participants aux sessions
Meteor.publish("users", function() {
  return Meteor.users.find({}, {fields: {username: 1}});
});
