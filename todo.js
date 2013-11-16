Todos = new Meteor.Collection('todos');

if (Meteor.isClient) {
  Template.allTodos.todos = function () {
    return Todos.find({user: Meteor.user()}, {sort: {name: 1}});
  }

  Template.todo.tag = function () {
    return Session.get('tag');
  }

  Template.todo.tagged = function () {
    return this.tags.indexOf(Session.get('tag')) > -1; 
  }

  Template.todocontent.addingtag = function () {
    return Session.get('addingtag') === this.name;
  }

  Template.todocontent.tags = function () {
    var todo_id = this._id;
    return _.map(this.tags || [], function (tag) {
      return {todo_id: todo_id, tag: tag};
    });
  }

  Template.forms.events({
    'click #search': function () {
      Session.set('tag', $('#tag').val());
    },

    'click #add': function () {
      Todos.insert({name: $('#todo').val(), user: Meteor.user()});
    }
  });

  Template.todocontent.events({
    'click #tagbtn': function () {
      Session.set('addingtag', this.name);
    },

    'blur #tagtext': function () {
      Todos.update({_id: this._id}, {$push: {tags: $('#tagtext').val()}});
      console.log(this._id);
    },

    'click .tag': function () {
      Todos.update({_id: this.todo_id}, {$pull: {tags: this.tag}});
    }
  });

  Template.todo.events({
  	'click .name': function () {
      Todos.remove({_id: this._id});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
