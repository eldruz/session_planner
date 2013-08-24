Template.inviteDialog.helpers({
  uninvited: function() {
    var session = Dosage.findOne(Session.get("selected"));
    return session ? Meteor.users.find({$nor: [{_id: {$in: session.invited}}, {_id: session.owner}]}) : [];
  }
});

Template.inviteDialog.events({
  'click .invite': function (event, template) {
    Meteor.call('invite', Session.get("selected"), this._id);
  },
  'click .done': function (event, template) {
    Session.set("showInviteDialog", false);
    return false;
  }
});
