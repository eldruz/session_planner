Template.admin_session.events({
  'click .delete-btn': function () {
    Dosage.remove(this._id);
  },
  'click .invite-btn': function () {
    Session.set("showInviteDialog", true);
  }
});
