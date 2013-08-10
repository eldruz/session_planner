// Subscriptions and options
Meteor.subscribe("sessions");
Meteor.subscribe("users");

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
    Session.set("showCreateDialog", false);
  });
});

// Global helpers
Handlebars.registerHelper("showUsername", function(userId) {
  return Meteor.users.findOne(userId).username;
});

// Template : page
Template.page.helpers({
  showCreateDialog: function () {
    return Session.get("showCreateDialog");
  }
});

Template.page.events ({
  'click .create-session': function(event) {
    if (! Meteor.user()) {
      console.log(this.userId);
      throw new Meteor.Error(403, "You must be logged in.");
    }
    Session.set("showCreateDialog", true);
  }
});

// Template : sessions_headers
Template.sessions_headers.helpers({
  sessions: function () {
    return Dosage.find();
  },
  selected: function () {
    return Session.equals('selected', this._id) ? 'active' : '';
  },
  open: function() {
    if (! this.open)
    return 'private-session';
  },
  momentDate: function() {
    var lang = ( navigator.language || navigator.browserLanguage ).slice( 0, 2 );
    moment.lang(lang, {
      calendar : {
        lastDay : '[Hier à] LT',
        sameDay : '[Aujourd\'hui à] LT',
        nextDay : '[Demain à] LT',
        lastWeek : 'dddd [dernier] [à] LT',
        nextWeek : 'dddd [à] LT',
        sameElse: 'L [à] LT'
      }
    });
    return moment(this.date).calendar();
  }
});

Template.sessions_headers.events({
  'click .session_header': function (event) {
    Session.set("selected", this._id);
  }
});

// Template : details
Template.details.helpers({
  session: function () {
    return Dosage.findOne(Session.get("selected"));
  },
  session_owner: function () {
    if (Meteor.user())
      return Dosage.findOne(Session.get("selected")).owner === this.userId;
    else
      return false;
  },
  nb_participants_confirmes: function () {
    var count=0;
    Dosage.find(Dosage.findOne(Session.get("selected"))).forEach(function (session) {
      count += _.where(session.participants, {rsvp: 'yes'}).length;
    });
    return count;
  },
  rsvp_icon: function (rsvp) {
    switch (rsvp) {
      case 'yes': return 'thumbs-up'; break;
      case 'no': return 'thumbs-down'; break;
      case 'maybe': return 'spinner icon-spin'; break;
      default: return 'question';
    }
  },
  each_sorted: function (participants, options) {
    var ret = "";

    var sort_username = function(a,b) {
      if (Meteor.users.findOne(a.user).username > Meteor.users.findOne(b.user).username)
        return 1;
      else if (Meteor.users.findOne(a.user).username < Meteor.users.findOne(b.user).username)
        return -1;
      else
        return 0;
    };

    participants.sort(function (a,b) {
      switch (a.rsvp) {
        case 'yes':
          switch (b.rsvp) {
            case 'yes': return sort_username(a,b); break;
            default: return -1; break;
          }
          break;
        case 'no':
          switch (b.rsvp) {
            case 'no': return 0; break;
            default: return 1; break;
          }
          break;
        case 'maybe':
          switch (b.rsvp) {
            case 'maybe': return 0; break;
            case 'no': return -1; break;
            case 'yes': return 1; break;
          }
          break;
      }
    })

    for(var i=0, j=participants.length; i<j; i++) {
      ret = ret + options.fn(participants[i]);
    }

    return ret;
  }
});

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

// Template admin_session
Template.admin_session.events({
  'click .delete-btn, dblclick .delete-btn': function () {
    Dosage.remove(this._id);
  }
});

// Template createDialog
Template.createDialog.events({
  'click .save': function (event, template) {
    var nom = template.find(".nom").value;
    var date = new Date(template.find(".date").value);
    var lieu = template.find(".lieu").value;
    var nb_places = parseInt(template.find(".nb_places").value);
    var description = template.find(".description").value;
    var open = ! template.find(".open").checked;

    if (nom.length && description.length) {
      Meteor.call('createSession', {
        nom: nom,
        date: date,
        lieu: lieu,
        description: description,
        nb_places: nb_places,
        open: open
      }, function (error, session) {
        if (!error) {
          Session.set("selected", session);
        }
      }); // Meteor.call
    } // if
  },

  'click .cancel': function(event, template) {
    Session.set("showCreateDialog", false);
  }
});
