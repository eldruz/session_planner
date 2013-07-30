Dosage = new Meteor.Collection('sessions_dose');

if (Meteor.isServer && Dosage.find().count() == 0) {
  var sessions = [
    {name: 'SacMania', members: 3, last_activity: '1 minute ago',
      participants: [
        {pseudo: 'eldruz', confirmation: 'yes'},
        {pseudo: 'zouzou', confirmation: 'maybe'},
        {pseudo: 'MasterCookie', confirmation: 'yes'},
      ]},
    {name: 'B.O.U.B.S.', members: 2, last_activity: '5 minutes ago'},
    {name: 'Ranking 3HitCombo', members: 0, last_activity: '3 days ago'}
  ];
  _.each(sessions, function(session) {
    Dosage.insert(session);
  });
}
