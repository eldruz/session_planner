// Publish fonctions

// On ne publie que les session publiques ou les privées crées par soi-même
Meteor.publish("sessions", function () {
  if (this.userId)
    return Dosage.find(
      {$and:[
        {$or: [{"open": true}, {"owner": this.userId}, {"invited": this.userId}]},
        {'date': {$gt: new Date()}}
      ]}
    );
  else
    return Dosage.find({"open": true});
});

// Publish all authorized sessions, regardless of dates
Meteor.publish("sessions_all", function () {
  if (this.userId)
    return Dosage.find(
        {$or: [{"open": true}, {"owner": this.userId}, {"invited": this.userId}]}
    );
  else
    return Dosage.find({"open": true});
});

// Only publish past authorized sessions
Meteor.publish("sessions_old", function () {
  if (this.userId)
    return Dosage.find(
      {$and:[
        {$or: [{"open": true}, {"owner": this.userId}, {"invited": this.userId}]},
        {'date': {$lt: new Date()}}
      ]}
    );
  else
    return Dosage.find({"open": true});
});

// On publie le nom des utilisateurs pour pouvoir les afficher en tant que créateur et participants aux sessions
Meteor.publish("users", function() {
  return Meteor.users.find({}, {fields: {username: 1}});
});
