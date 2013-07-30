Meteor.Router.add({
  '/': 'home',
});

Template.liste_sessions.helpers({
  sessions: function() { return Dosage.find(); }
})
