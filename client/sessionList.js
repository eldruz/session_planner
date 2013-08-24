Template.sessionList.helpers({
  session: function () {
    keywords = new RegExp(Session.get("search_keywords"), "i");
    return Dosage.find({$or: [{nom: keywords}, {lieu: keywords}, {date: keywords}]},
                        {sort: [["open", "asc"], ["date", "asc"], ["nom", "asc"]]});
  }
});

Template.sessionItem.helpers({
  selected: function () {
    return Session.equals('selected', this._id) ? 'active' : '';
  },
  open: function() {
    return this.open ? '' : 'private-session';
  },
  momentDate: function() {
    var lang = ( navigator.language || navigator.browserLanguage ).slice( 0, 2 );
    moment.lang(lang);
    return moment(this.date).format('dddd D MMMM  H:mm');
  }
});

Template.sessionItem.events({
  'click .session-item': function () {
    Session.set('selected', this._id);
  }
});

Template.sessionItem.rendered = function () {
  if (Session.equals('selected', this.data._id))
    $(this.firstNode).fadeOut().fadeIn();
};
