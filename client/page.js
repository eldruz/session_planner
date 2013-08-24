Template.inviteDialogWrapper.helpers({
  showInviteDialog: function () {
    return Session.get("showInviteDialog");
  }
});

Template.createDialogWrapper.helpers({
	showCreateDialog: function () {
    return Session.get("showCreateDialog");
  }
});