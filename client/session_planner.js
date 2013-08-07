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
    // console.log(this._id);
  }
});

// Template : details
Template.details.session = function() {
  return Dosage.findOne(Session.get("selected"));
}

Template.details.session_owner = function() {
  if (Meteor.user())
    return Dosage.findOne(Session.get("selected")).owner === Meteor.user().username;
  else
    return false;
}

Template.details.nb_participants_confirmes = function () {
  var count=0;
  Dosage.find(Dosage.findOne(Session.get("selected"))).forEach(function (session) {
    count += _.where(session.participants, {rsvp: 'yes'}).length;
  });
  return count;
}

Template.details.events({
  'click .rsvp_yes': function () {
    Meteor.call("participeSession", Session.get("selected"), "yes");
    return false;
  },
  'click .rsvp_maybe': function () {
    Meteor.call("participeSession", Session.get("selected"), "maybe");
    return false;
  },
  'click .rsvp_no': function () {
    Meteor.call("participeSession", Session.get("selected"), "no");
    return false;
  }
});

Template.admin_session.events({
  'click .delete-btn': function () {
    Dosage.remove(this._id);
  }
});
