// Subscriptions and options
Meteor.subscribe("sessions_dose");

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

//If no session selected, select one.
Meteor.startup(function () {
  Deps.autorun(function () {
    if (! Session.get("selected")) {
      var session = Dosage.findOne();
      if (session)
        Session.set("selected", session._id);
    }
  });
});

// Template : sessions_headers
Template.sessions_headers.sessions = function() {
  return Dosage.find();
}

Template.sessions_headers.selected = function () {
  return Session.equals('selected', this._id) ? 'active' : '';
};

Template.sessions_headers.events({
  'click .session_header': function (event) {
    Session.set("selected", this._id);
  }
});

// Template : details
Template.details.session = function() {
  return Dosage.findOne(Session.get("selected"));
}
