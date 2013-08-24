// Publish fonctions

// Sessions published depends on the option parameter for either future, past or all sessions
Meteor.publish("sessions", function (option) {
	var userId = this.userId;
  if (userId) {
    var or_selector = {$or: [{'open': true}, {'owner': userId}, {'invited': userId}]},
        choices = {
      future: function() {
        return Dosage.find(
          {$and:[
            or_selector,
            {'date': {$gt: new Date()}}
          ]}
        );
      },
      old: function() {
        return Dosage.find(
          {$and:[
            or_selector,
            {'date': {$lt: new Date()}}
          ]}
        );
      },
      all: function() {
        return Dosage.find(
          or_selector
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
