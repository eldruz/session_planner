Template.createDialog.events({
  'click .save': function (event, template) {
    var nom         = template.find(".nom").value,
        date        = new Date(template.find(".date").value),
        lieu        = template.find(".lieu").value,
        nb_places   = parseInt(template.find(".nb_places").value, 10),
        description = template.find(".description").value,
        open        = ! template.find(".open").checked;

    if (nom.length && description.length) {
      Meteor.call('createSession', {
        nom         : nom,
        date        : date,
        lieu        : lieu,
        description : description,
        nb_places   : nb_places,
        open        : open
      }, function (error, session) {
        if (!error) {
          Session.set("selected", session);
          Session.set("showCreateDialog", false);
        }
      }); // Meteor.call
    } // if
  },

  'click .cancel': function(event, template) {
    Session.set("showCreateDialog", false);
  }
});
