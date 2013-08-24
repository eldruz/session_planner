Template.page.helpers({
  showCreateDialog: function () {
    return Session.get("showCreateDialog");
  },
  showInviteDialog: function () {
    return Session.get("showInviteDialog");
  }
});

Template.page.events ({
  'click .create-session': function(event) {
    if (! Meteor.user()) {
      console.log(this.userId);
      throw new Meteor.Error(403, "You must be logged in.");
    }
    Session.set("showCreateDialog", true);
  },
  'keyup [name=search]': function (e, context) {
    Session.set("search_keywords", e.currentTarget.value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"));
  }
});
