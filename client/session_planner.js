Meteor.Router.add({
  '/': 'home',
  '/sessions/:id': function(id) {
    Session.set('currentSessionId', id);
    return 'session';
  }
});

Template.sessions.helpers({
  sessions: function() { return Dosage.find(); }
});

Template.session.helpers({
  session: function() {return Dosage.findOne(Session.get('currentSessionId')); }
});


