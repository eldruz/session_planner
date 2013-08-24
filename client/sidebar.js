Template.sessions_headers.helpers({
  sessions: function () {
    keywords = new RegExp(Session.get("search_keywords"), "i");
    return Dosage.find({$or: [{nom: keywords}, {owner: keywords}, {date: keywords}]},
                        {sort: [["open", "asc"], ["date", "asc"], ["nom", "asc"]]});
  }
});

Template.sessions_items.helpers({
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

Template.sessions_items.events({
  'click .session_header': function () {
    Session.set('selected', this._id);
  }
});

Template.sessions_items.rendered = function () {
  if (Session.equals('selected', this.data._id))
    $(this.firstNode).fadeOut().fadeIn();
};
