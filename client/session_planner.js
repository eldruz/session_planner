// Subscriptions and options
var sessions_subscriptions, users_subscriptions;

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

//If no session selected, select one.
Meteor.startup(function () {
  Session.setDefault("showCreateDialog", false);
  Session.setDefault("showInviteDialog", false);
  Session.setDefault("sessionsSelector", "future");
  
  Deps.autorun(function () {
    sessions_subscriptions = Meteor.subscribe("sessions", Session.get("sessionsSelector"));
    users_subscriptions = Meteor.subscribe("users");
  });
});

// Global helpers
Handlebars.registerHelper("showUsername", function(userId) {
  return Meteor.users.findOne(userId).username;
});
