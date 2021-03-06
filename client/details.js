Template.details.helpers({
  session: function () {
    return Dosage.findOne(Session.get("selected"));
  },
  session_owner: function () {
    return Meteor.user() ? Dosage.findOne(Session.get("selected")).owner === Meteor.user()._id : false;
  },
  nb_participants_confirmes: function () {
    var count=0;
    Dosage.find(Dosage.findOne(Session.get("selected"))).forEach(function (session) {
      count += _.where(session.participants, {rsvp: 'yes'}).length;
    });
    return count;
  },
  rsvp_icon: function (rsvp) {
    var rsvp_choices = {
      yes: function() { return 'ok'; },
      no: function() { return 'remove'; },
      maybe: function() { return 'question'; }
    };
    return rsvp_choices[rsvp]();
  },
  each_sorted: function (participants, options) {
    var ret = "",
        sort_username = function(a,b) {
          var a_username = Meteor.users.findOne(a.user).username,
              b_username = Meteor.users.findOne(b.user).username;
          if (a_username > b_username)
            return 1;
          else if (a_username < b_username)
            return -1;
          else
            return 0;
        };

    participants.sort(function (a,b) {
      var choices = {
        yes: function() {
          if (b.rsvp === 'yes') return sort_username(a,b); else return -1;
        },
        no: function() {
          if (b.rsvp === 'no') return sort_username(a,b); else return 1;
        },
        maybe: function() {
          if (b.rsvp === 'maybe') return sort_username(a,b);
          else if (b.rsvp === 'yes') return 1;
          else if (b.rsvp === 'no') return -1;
        }
      };

      return choices[a.rsvp]();
    });

    participants.forEach(function(participant) {
      ret += options.fn(participant);
    });

    return ret;
  },
  is_invited: function () {
    var session = Dosage.findOne(Session.get("selected"));
    return (jQuery.inArray(this.user, session.invited) > -1);
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
