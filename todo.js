// new mongodb collection to store todos in
Todos = new Meteor.Collection('todos');

if (Meteor.isClient) {
  Template.allTodos.todos = function () {
    // return all todos of the current user in alphabetical order
    return Todos.find({user: Meteor.user()}, {sort: {name: 1}});
  }

  Template.todo.tag = function () {
    return Session.get('tag');
  }

  Template.todo.tagged = function () {
    // if the session tag is in the todos tags, it will return True
    return this.tags.indexOf(Session.get('tag')) > -1; 
  }

  Template.todocontent.addingtag = function () {
    // returns true if this is the todo that is getting a tag added
    return Session.get('addingtag') === this.name;
  }

  Template.todocontent.tags = function () {
    var todo_id = this._id;
    // return an array with each object (a tag) having 2 attributes, the id of the todo it belongs to, and the tag itself.
    return _.map(this.tags || [], function (tag) {
      return {todo_id: todo_id, tag: tag};
    });
  }

  Template.forms.events({
    'click #search': function () {
      // set a session variable with the tag to search
      Session.set('tag', $('#tag').val());
    },

    'click #add': function () {
      // add a todo with the contents of the todo text box, and the current user as the user
      Todos.insert({name: $('#todo').val(), user: Meteor.user()});
    }
  });

  Template.todocontent.events({
    'click #tagbtn': function () {
      // set a session variable with the name of the todo that is having a tag added
      Session.set('addingtag', this.name);
    },

    'blur #tagtext': function () {
      // adds the contents of the tag text box as a new tag to the current todo
      Todos.update({_id: this._id}, {$push: {tags: $('#tagtext').val()}});
    },

    'click .tag': function () {
      // removes the tag that was clicked on from the todo
      Todos.update({_id: this.todo_id}, {$pull: {tags: this.tag}});
    },

    'click .name': function () {
      // removes the todo that was clicked on
      Todos.remove({_id: this._id});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
