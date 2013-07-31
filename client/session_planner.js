Meteor.Router.add({
  '/': 'liste_sessions',
  '/creation': 'creation'
});

Template.liste_sessions.helpers({
  sessions: function() { return Dosage.find(); }
})

function creation_submit() {
    form={};

    $.each($('#creation-form').serializeArray(), function() {
        form[this.name] = this.value;
    });

    //do validation on form={firstname:'first name', lastname: 'last name', email: 'email@email.com'}

    Dosage.insert(form, function(err) {
        if(!err) {
            alert("Submitted!");
            $('#creation-form')[0].reset();
        }
        else
        {
            alert("Something is wrong");
            console.log(err);
        }
    });

}

Template.creation.events({'submit' : function() {
    creation_submit();
    event.preventDefault();
}});
