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
  'click .session-item': function (event, template) {
    Session.set('selected', this._id);
    $(template.firstNode.nextElementSibling).slideToggle();
  }
});

Template.sessionItem.rendered = function () {
  // If we come from the right template instance and if triggered by a click in .session-item
  // if (Session.equals('selected', this.data._id) && this.data.isClicked === true) {
  //   this.data.isClicked = false;
  //   $(this.firstNode.nextElementSibling).slideToggle('fast');
  // }
};
